import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaUsuariosService } from './prisma-usuarios.service';
import { PrismaCarrerasService } from './prisma-carreras.service';
import { PrismaProfesoresService } from './prisma-profesores.service';

@Global()
@Module({
  providers: [
    PrismaService, 
    PrismaUsuariosService, 
    PrismaCarrerasService, 
    PrismaProfesoresService
  ],
  exports: [
    PrismaService, 
    PrismaUsuariosService, 
    PrismaCarrerasService, 
    PrismaProfesoresService
  ],
})
export class PrismaModule {}