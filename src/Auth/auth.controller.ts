import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 👇 ESTO ES LO QUE FALTABA 👇
  @Post('register')
  async register(@Body() body: any) {
    // Recibe: nombre, email, password
    return this.authService.register(body);
  }
  // 👆 ---------------------- 👆

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password); 
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    return this.authService.login(user);
  }
}