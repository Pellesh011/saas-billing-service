import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface PermissionRequest {
  resource: string;
  scope: string;
}

export interface AuthorizationResult {
  granted: boolean;
  permissions?: Array<{ resource: string; scopes: string[] }>;
}

@Injectable()
export class KeycloakAuthzService {
  private readonly logger = new Logger(KeycloakAuthzService.name);
  private serviceAccessToken: string | null = null;
  private serviceTokenExpiry: number = 0;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  private get keycloakUrl(): string {
    return this.configService.get<string>('config.keycloak.url')!;
  }

  private get realm(): string {
    return this.configService.get<string>('config.keycloak.realm')!;
  }

  private get clientId(): string {
    return this.configService.get<string>('config.keycloak.clientId')!;
  }

  private get clientSecret(): string {
    return this.configService.get<string>('config.keycloak.clientSecret')!;
  }

  private get tokenUrl(): string {
    return `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/token`;
  }

  async checkPermission(
    resource: string,
    scope: string,
    userAccessToken: string,
  ): Promise<boolean> {
    try {
      const params = new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:uma-ticket',
        audience: this.clientId,
        permission: `${resource}#${scope}`,
        response_mode: 'decision',
      });

      await firstValueFrom(
        this.httpService.post(this.tokenUrl, params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${userAccessToken}`,
          },
        }),
      );

      return true;
    } catch (error) {
      const err = error as {
        response?: { status?: number; data?: { error?: string } };
        message?: string;
      };

      if (err.response?.status === 403) {
        return false;
      }

      this.logger.error(
        `Permission check failed for ${resource}#${scope}: ${err.message}`,
        err.response?.data,
      );
      return false;
    }
  }

  async checkPermissions(
    userAccessToken: string,
    permissions: PermissionRequest[],
  ): Promise<AuthorizationResult> {
    const results = await Promise.all(
      permissions.map(async ({ resource, scope }) => ({
        resource,
        scope,
        granted: await this.checkPermission(resource, scope, userAccessToken),
      })),
    );

    const allGranted = results.every((r) => r.granted);
    const grantedPermissions = results
      .filter((r) => r.granted)
      .reduce(
        (acc, { resource, scope }) => {
          const existing = acc.find((p) => p.resource === resource);
          if (existing) {
            existing.scopes.push(scope);
          } else {
            acc.push({ resource, scopes: [scope] });
          }
          return acc;
        },
        [] as Array<{ resource: string; scopes: string[] }>,
      );

    return {
      granted: allGranted,
      permissions: grantedPermissions.length > 0 ? grantedPermissions : undefined,
    };
  }

  async getServiceAccountToken(): Promise<string | null> {
    if (this.serviceAccessToken && Date.now() < this.serviceTokenExpiry) {
      return this.serviceAccessToken;
    }

    try {
      const params = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
      });

      const response = await firstValueFrom(
        this.httpService.post(this.tokenUrl, params, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }),
      );

      this.serviceAccessToken = response.data.access_token;
      this.serviceTokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;

      return this.serviceAccessToken;
    } catch (error) {
      const err = error as {
        response?: { data?: { error_description?: string } };
        message?: string;
      };
      this.logger.error(
        'Failed to obtain service account token',
        err.response?.data ?? err.message,
      );
      return null;
    }
  }

  async introspectToken(token: string): Promise<{ active: boolean; permissions?: unknown[] }> {
    const serviceToken = await this.getServiceAccountToken();
    if (!serviceToken) {
      return { active: false };
    }

    try {
      const params = new URLSearchParams({
        token,
        token_type_hint: 'access_token',
      });

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/token/introspect`,
          params,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Bearer ${serviceToken}`,
            },
          },
        ),
      );

      return {
        active: response.data.active ?? false,
        permissions: response.data.permissions,
      };
    } catch (error) {
      const err = error as { response?: { data?: unknown }; message?: string };
      this.logger.error('Token introspection failed', err.response?.data ?? err.message);
      return { active: false };
    }
  }
}
