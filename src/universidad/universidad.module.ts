import { Module } from '@nestjs/common';
import { UniversidadService } from './universidad.service';
import { UniversidadController } from './universidad.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UniversidadController],
  providers: [UniversidadService],
  exports: [UniversidadService], // ESTA LÍNEA ES VITAL
})
export class UniversidadModule {}