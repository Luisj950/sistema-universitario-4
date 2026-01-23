import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
// IMPORTANTE: Importa el módulo que contiene los servicios de base de datos
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule, // 👈 ESTO ES OBLIGATORIO para que funcione la inyección
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || '123',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}