import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller.js';
import { KeycloakStrategy } from './strategies/keycloak.strategy.js';
import { KeycloakAuthzService } from '../keycloak/keycloak-authz.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule, HttpModule, PassportModule.register({ defaultStrategy: 'keycloak' })],
  controllers: [AuthController],
  providers: [KeycloakStrategy, KeycloakAuthzService],
  exports: [KeycloakAuthzService],
})
export class AuthModule {}
