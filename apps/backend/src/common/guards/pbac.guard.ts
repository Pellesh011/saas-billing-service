import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { KeycloakAuthzService } from '../../keycloak/keycloak-authz.service.js';
import {
  REQUIRE_PERMISSION_KEY,
  RequirePermissionOptions,
} from '../decorators/require-permission.decorator.js';

@Injectable()
export class PbacGuard implements CanActivate {
  private readonly logger = new Logger(PbacGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly authzService: KeycloakAuthzService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.getAllAndOverride<RequirePermissionOptions>(
      REQUIRE_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!permission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    const authHeader = request.headers?.authorization as string | undefined;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const userAccessToken = authHeader.slice(7);

    const granted = await this.authzService.checkPermission(
      permission.resource,
      permission.scope,
      userAccessToken,
    );

    if (!granted) {
      this.logger.warn(
        `Access denied: user ${user.id} (${user.email}) lacks permission ${permission.resource}#${permission.scope}`,
      );
      throw new ForbiddenException(
        `Insufficient permissions: required ${permission.resource}#${permission.scope}`,
      );
    }

    this.logger.debug(
      `Access granted: user ${user.id} (${user.email}) has permission ${permission.resource}#${permission.scope}`,
    );
    return true;
  }
}
