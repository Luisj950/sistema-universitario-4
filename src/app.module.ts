import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { EstudiantesModule } from './estudiantes/estudiantes.module';
import { AuthModule } from './Auth/auth.module';
import { CarrerasModule } from './carreras/carreras.module';
// 👇 1. IMPORTA EL MÓDULO DE PROFESORES
import { ProfesoresModule } from './profesores/profesores.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    EstudiantesModule,
    AuthModule,
    CarrerasModule,
    // 👇 2. AGRÉGALO A LA LISTA DE IMPORTS
    ProfesoresModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}