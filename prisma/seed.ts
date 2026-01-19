import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// 1. Cargar variables de entorno
dotenv.config();

// 2. Configurar la conexión para Prisma 7
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando carga de datos en el IST Sudamericano...');

  // 3. Limpieza de tablas (Orden de integridad referencial para evitar errores de FK)
  await prisma.inscripcion.deleteMany({});
  await prisma.estudiante.deleteMany({});
  await prisma.asignatura.deleteMany({});
  await prisma.carrera.deleteMany({});

  // 4. Crear Carreras con nombres reales
  const software = await prisma.carrera.create({
    data: { nombre: 'Desarrollo de Software' },
  });

  const diseno = await prisma.carrera.create({
    data: { nombre: 'Diseño Gráfico' },
  });

  // 5. Crear Asignaturas (Incluye una con 0 cupos para tu prueba de ACID)
  await prisma.asignatura.create({
    data: { nombre: 'Arquitectura NestJS', cuposDisponibles: 12 },
  });

  await prisma.asignatura.create({
    data: { nombre: 'Bases de Datos con Prisma 7', cuposDisponibles: 15 },
  });

  await prisma.asignatura.create({
    data: { nombre: 'Taller de UI/UX Avanzado', cuposDisponibles: 0 }, // Para probar error de cupos
  });

  // 6. Carga de 10 Estudiantes Reales (8 Activos y 2 Inactivos para pruebas de lógica)
  const estudiantesRealistas = [
    { nombre: 'Luis', apellido: 'Jaramillo', activo: true, carreraId: software.id },
    { nombre: 'Ana', apellido: 'Pazmiño', activo: true, carreraId: software.id },
    { nombre: 'Pedro', apellido: 'Vintimilla', activo: false, carreraId: software.id },
    { nombre: 'María', apellido: 'Auxiliadora', activo: true, carreraId: software.id },
    { nombre: 'Carlos', apellido: 'Ortiz', activo: true, carreraId: diseno.id },
    { nombre: 'Elena', apellido: 'Cuenca', activo: true, carreraId: diseno.id },
    { nombre: 'Diego', apellido: 'Mora', activo: true, carreraId: software.id },
    { nombre: 'Lucía', apellido: 'Vera', activo: true, carreraId: diseno.id },
    { nombre: 'Juan', apellido: 'Zúñiga', activo: false, carreraId: diseno.id },
    { nombre: 'Sofía', apellido: 'Cárdenas', activo: true, carreraId: software.id },
  ];

  console.log('📡 Insertando estudiantes...');
  for (const est of estudiantesRealistas) {
    await prisma.estudiante.create({
      data: est,
    });
  }

  console.log('✅ Seed completado con éxito: 10 estudiantes y 3 asignaturas creados.');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });