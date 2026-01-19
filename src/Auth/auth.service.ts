import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

// 1. CAMBIO AQUÍ: Importamos el PrismaService unificado
import { PrismaService } from '../prisma/prisma.service'; 

@Injectable()
export class AuthService {
  constructor(
    // 2. CAMBIO AQUÍ: Inyectamos PrismaService, que contiene todos los modelos
    private prisma: PrismaService, 
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    // Ahora this.prisma.user funcionará porque PrismaService conoce el modelo User
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  
  async login(user: any) {
    const payload = { email: user.email, sub: user.id, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, nombre } = registerDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nombre,
        roles: ["user"] 
      },
    });
  }
}