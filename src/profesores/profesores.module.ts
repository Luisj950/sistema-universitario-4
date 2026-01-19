import { Module } from '@nestjs/common';
import { ProfesoresService } from './profesores.service';
import { ProfesoresController } from './profesores.controller';
// Importamos PrismaModule para poder usar el servicio de base de datos
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], 
  controllers: [ProfesoresController],
  providers: [ProfesoresService],
})
export class ProfesoresModule {}