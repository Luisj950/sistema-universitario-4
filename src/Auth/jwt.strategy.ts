import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// 1. IMPORTA EL SERVICIO DE USUARIOS
import { PrismaUsuariosService } from '../prisma/prisma-usuarios.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
      // 2. INYECTA EL SERVICIO CORRECTO
      private prisma: PrismaUsuariosService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || '123',
    });
  }

  async validate(payload: any) {
    // 3. Busca el usuario por ID
    const user = await this.prisma.estudiante.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}