import { Injectable } from '@nestjs/common';
import { PrismaProfesoresService } from '../prisma/prisma-profesores.service'; // <--- OJO: Importamos el servicio de Profesores

@Injectable()
export class ProfesoresService {
  constructor(private prisma: PrismaProfesoresService) {}

  create(data: any) {
    return this.prisma.profesor.create({
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        // titulos: ... (opcional por ahora)
      },
    });
  }

  findAll() {
    return this.prisma.profesor.findMany();
  }
}