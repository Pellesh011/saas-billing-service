import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { KeycloakAuthGuard } from '../common/guards/keycloak-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { PbacGuard } from '../common/guards/pbac.guard.js';
import { RequirePermission } from '../common/decorators/require-permission.decorator.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Get('me')
  @UseGuards(KeycloakAuthGuard, PbacGuard)
  @RequirePermission('auth', 'write')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Текущий пользователь' })
  @ApiResponse({ status: 200, description: 'Данные пользователя' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async getMe(
    @CurrentUser()
    user: {
      id: string;
      email: string;
      role: string;
      firstName?: string;
      lastName?: string;
    },
  ) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  @Get('demo/read')
  @UseGuards(KeycloakAuthGuard, PbacGuard)
  @RequirePermission('invoices', 'read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Demo PBAC: invoices#read' })
  @ApiResponse({ status: 200, description: 'Granted' })
  @ApiResponse({ status: 403, description: 'Denied' })
  async demoRead() {
    return { message: 'invoices#read — GRANTED' };
  }

  @Get('demo/write')
  @UseGuards(KeycloakAuthGuard, PbacGuard)
  @RequirePermission('invoices', 'write')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Demo PBAC: invoices#write' })
  @ApiResponse({ status: 200, description: 'Granted' })
  @ApiResponse({ status: 403, description: 'Denied' })
  async demoWrite() {
    return { message: 'invoices#write — GRANTED' };
  }
}
