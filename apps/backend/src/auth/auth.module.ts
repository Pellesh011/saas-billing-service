import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller.js';
import { KeycloakStrategy } from './strategies/keycloak.strategy.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'keycloak' }),
  ],
  controllers: [AuthController],
  providers: [KeycloakStrategy],
})
export class AuthModule {}
