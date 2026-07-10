import { SetMetadata } from '@nestjs/common';

export const REQUIRE_PERMISSION_KEY = 'pbac:permission';

export interface RequirePermissionOptions {
  resource: string;
  scope: string;
}

export const RequirePermission = (resource: string, scope: string) =>
  SetMetadata(REQUIRE_PERMISSION_KEY, { resource, scope } as RequirePermissionOptions);
