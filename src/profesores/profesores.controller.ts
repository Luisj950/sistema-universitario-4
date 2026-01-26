import { Controller, Post, Body } from '@nestjs/common';
import { ProfesoresService } from './profesores.service';
import { CreateProfesorDto } from './dto/create-profesor.dto';

@Controller('profesores')
export class ProfesoresController {
  constructor(private readonly profesoresService: ProfesoresService) {}

  @Post()
  create(@Body() createProfesorDto: CreateProfesorDto) {
    return this.profesoresService.create(createProfesorDto);
  }
}