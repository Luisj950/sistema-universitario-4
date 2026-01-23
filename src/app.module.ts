import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { EstudiantesModule } from './estudiantes/estudiantes.module';
import { AuthModule } from './Auth/auth.module';
import { CarrerasModule } from './carreras/carreras.module';
import { ProfesoresModule } from './profesores/profesores.module';
// 👇 1. IMPORTA TU NUEVO MÓDULO UNIVERSIDAD
import { UniversidadModule } from './universidad/universidad.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    EstudiantesModule,
    AuthModule,
    CarrerasModule,
    ProfesoresModule, 
    // 👇 2. AGRÉGALO AL ARRAY DE IMPORTS
    UniversidadModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}