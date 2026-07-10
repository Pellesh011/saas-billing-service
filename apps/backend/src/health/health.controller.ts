import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service.js';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Проверка состояния приложения' })
  @ApiResponse({ status: 200, description: 'Приложение работает' })
  async check() {
    return this.healthService.check();
  }
}
