import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
// ✅ CORRECCIÓN: Apuntamos a la carpeta dto para ser consistentes
import { LoginDto } from './dto/login.dto'; 
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // Ahora sí encontrará validateUser porque aseguramos que esté en el servicio
    const user = await this.authService.validateUser(loginDto.email, loginDto.password); 
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    return this.authService.login(user);
  }
}