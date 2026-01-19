import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando carga de datos para el IST Sudamericano...');

  // 1. Limpieza segura (evita duplicados al re-ejecutar)
  await prisma.inscripcion.deleteMany({});
  await prisma.estudiante.deleteMany({});
  await prisma.materia.deleteMany({}); // Si tienes este modelo, sino bórralo
  await prisma.asignatura.deleteMany({});
  await prisma.carrera.deleteMany({});

  // 2. Crear Carreras (Software y Diseño)
  const software = await prisma.carrera.create({
    data: { nombre: 'Desarrollo de Software' },
  });

  const diseno = await prisma.carrera.create({
    data: { nombre: 'Diseño Gráfico' },
  });

  // 3. Crear Asignaturas para pruebas ACID
  await prisma.asignatura.create({
    data: { nombre: 'Arquitectura NestJS', cuposDisponibles: 10 },
  });

  await prisma.asignatura.create({
    data: { nombre: 'Taller de UI/UX', cuposDisponibles: 0 }, // Para probar fallos de ACID
  });

  // 4. Crear 10 Estudiantes vinculados a las carreras
  const estudiantesData = [
    { nombre: 'Luis', apellido: 'Jaramillo', activo: true, carreraId: software.id },
    { nombre: 'Carlos', apellido: 'Pérez', activo: true, carreraId: software.id },
    { nombre: 'María', apellido: 'Sánchez', activo: true, carreraId: diseno.id },
    { nombre: 'Ana', apellido: 'Mora', activo: false, carreraId: software.id },
    { nombre: 'Pedro', apellido: 'García', activo: true, carreraId: software.id },
    { nombre: 'Elena', apellido: 'Torres', activo: true, carreraId: diseno.id },
    { nombre: 'Diego', apellido: 'Vera', activo: true, carreraId: software.id },
    { nombre: 'Lucía', apellido: 'Rojas', activo: true, carreraId: diseno.id },
    { nombre: 'Juan', apellido: 'Ortiz', activo: false, carreraId: diseno.id },
    { nombre: 'Sofía', apellido: 'Castro', activo: true, carreraId: software.id },
  ];

  for (const est of estudiantesData) {
    await prisma.estudiante.create({ data: est });
  }

  console.log('✅ Seed completado con éxito: 10 registros creados.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });