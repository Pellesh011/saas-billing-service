import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { KeycloakAuthGuard } from '../common/guards/keycloak-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Get('me')
  @UseGuards(KeycloakAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Текущий пользователь' })
  @ApiResponse({ status: 200, description: 'Данные пользователя' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async getMe(
    @CurrentUser() user: { id: string; email: string; role: string; firstName?: string; lastName?: string },
  ) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
