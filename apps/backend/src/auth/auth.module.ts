import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { KeycloakStrategy } from './strategies/keycloak.strategy';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'keycloak' }),
  ],
  controllers: [AuthController],
  providers: [KeycloakStrategy],
})
export class AuthModule {}
