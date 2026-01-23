import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
// ✅ IMPORTACIÓN CORRECTA: Usamos el servicio de usuarios
import { PrismaUsuariosService } from '../prisma/prisma-usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    // ✅ INYECCIÓN CORRECTA: Usamos PrismaUsuariosService
    private prisma: PrismaUsuariosService,
    private jwtService: JwtService,
  ) {}

  // 👇 ESTA FUNCIÓN ES LA QUE TE FALTABA O ESTABA DAÑADA
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.estudiante.findFirst({
      where: { email },
    });

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  
  // 👇 ESTA TAMBIÉN DEBE ESTAR
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, nombre } = registerDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.estudiante.create({
      data: {
        email,
        password: hashedPassword,
        nombre,
        // Manejo seguro de opcionales para evitar errores
        apellido: registerDto.apellido || 'Sin apellido',
        carreraId: registerDto.carreraId || 'sin-carrera',
        activo: true
      },
    });
  }
}