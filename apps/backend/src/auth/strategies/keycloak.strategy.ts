import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '../../prisma_client/generated/client';

interface KeycloakTokenPayload {
  sub: string;
  email?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: {
    roles: string[];
  };
  iss?: string;
  aud?: string | string[];
}

@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, 'keycloak') {
  private readonly logger = new Logger(KeycloakStrategy.name);

  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const keycloakUrl = configService.get<string>('config.keycloak.url')!;
    const realm = configService.get<string>('config.keycloak.realm')!;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri: `${keycloakUrl}/realms/${realm}/protocol/openid-connect/certs`,
      }),
      issuer: `${keycloakUrl}/realms/${realm}`,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: KeycloakTokenPayload) {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const keycloakId = payload.sub;
    const email = payload.email || `${payload.preferred_username}@keycloak.local`;
    const firstName = payload.given_name || payload.preferred_username;
    const lastName = payload.family_name || '';

    const role = this.mapRole(payload.realm_access?.roles);

    let user = await this.prisma.user.findUnique({
      where: { keycloakId },
    });

    if (!user) {
      user = await this.prisma.user.findUnique({
        where: { email },
      });
    }

    if (user) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          keycloakId,
          email,
          firstName,
          lastName,
          role,
          lastLoginAt: new Date(),
        },
      });
    } else {
      user = await this.prisma.user.create({
        data: {
          keycloakId,
          email,
          firstName,
          lastName,
          role,
          isActive: true,
          lastLoginAt: new Date(),
        },
      });

      this.logger.log(`Auto-provisioned user from Keycloak: ${email} (${keycloakId})`);
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  private mapRole(keycloakRoles?: string[]): Role {
    if (!keycloakRoles || keycloakRoles.length === 0) {
      return Role.VIEWER;
    }

    const rolePriority: Record<string, Role> = {
      ADMIN: Role.ADMIN,
      MANAGER: Role.MANAGER,
      VIEWER: Role.VIEWER,
    };

    for (const keycloakRole of keycloakRoles) {
      const mapped = rolePriority[keycloakRole];
      if (mapped) {
        return mapped;
      }
    }

    return Role.VIEWER;
  }
}
