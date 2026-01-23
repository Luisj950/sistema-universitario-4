import { Global, Module } from '@nestjs/common';
import { PrismaUsuariosService } from './prisma-usuarios.service';
import { PrismaProfesoresService } from './prisma-profesores.service';
import { PrismaCarrerasService } from './prisma-carreras.service';
// El PrismaService genérico ya no es estrictamente necesario, pero puedes dejarlo si quieres
// import { PrismaService } from './prisma.service'; 

@Global()
@Module({
  providers: [
    PrismaUsuariosService, 
    PrismaProfesoresService, 
    PrismaCarrerasService
  ],
  exports: [
    PrismaUsuariosService, 
    PrismaCarrerasService, 
    PrismaProfesoresService
  ],
})
export class PrismaModule {}