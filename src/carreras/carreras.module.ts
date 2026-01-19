import { Module } from '@nestjs/common';
import { CarrerasController } from './carreras.controller';
import { UniversidadModule } from '../universidad/universidad.module';

@Module({
  // Importamos UniversidadModule para tener acceso al UniversidadService que exportamos arriba
  imports: [UniversidadModule], 
  controllers: [CarrerasController],
})
export class CarrerasModule {}