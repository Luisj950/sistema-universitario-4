import { Controller, Get, Post, Body } from '@nestjs/common';
import { UniversidadService } from '../universidad/universidad.service';

@Controller('carreras')
export class CarrerasController {
  constructor(private readonly service: UniversidadService) {}

  @Post()
  create(@Body() createCarreraDto: { nombre: string }) {
    return this.service.create(createCarreraDto); // Ahora TypeScript encontrará el método
  }

  @Get()
  findAll() {
    return this.service.findAll(); // Ahora TypeScript encontrará el método
  }
}