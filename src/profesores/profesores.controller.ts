import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProfesoresService } from './profesores.service';

@Controller('profesores')
export class ProfesoresController {
  constructor(private readonly profesoresService: ProfesoresService) {}

  @Post()
  create(@Body() body: { nombre: string; apellido: string }) {
    return this.profesoresService.create(body);
  }

  @Get()
  findAll() {
    return this.profesoresService.findAll();
  }
}