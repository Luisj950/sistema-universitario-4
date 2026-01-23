import { Module } from '@nestjs/common';
import { UniversidadService } from './universidad.service';
import { UniversidadController } from './universidad.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],       // ✅ Se importa para usar sus servicios
  controllers: [UniversidadController],
  providers: [UniversidadService],
  exports: [UniversidadService], // ✅ SOLO exportamos el servicio propio. ¡NO exportes PrismaModule!
})
export class UniversidadModule {}