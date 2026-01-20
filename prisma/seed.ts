import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando carga masiva de datos en el IST Sudamericano...');

  // 1. Limpieza de tablas
  await prisma.inscripcion.deleteMany({});
  await prisma.estudiante.deleteMany({});
  await prisma.asignatura.deleteMany({});
  await prisma.docente.deleteMany({});
  await prisma.carrera.deleteMany({});

  // 2. Crear Carreras
  const software = await prisma.carrera.create({ data: { nombre: 'Software' } });
  const diseno = await prisma.carrera.create({ data: { nombre: 'Diseño' } });

  // 3. Crear Docentes
  const prof1 = await prisma.docente.create({ 
    data: { nombre: 'Roberto Eras', tipoContrato: 'TIEMPO_COMPLETO' } 
  });
  const prof2 = await prisma.docente.create({ 
    data: { nombre: 'Maria Solano', tipoContrato: 'TIEMPO_COMPLETO' } 
  });

  // 4. Crear Asignaturas
  await prisma.asignatura.create({
    data: { nombre: 'NestJS', cuposDisponibles: 10, carreraId: software.id, docenteId: prof1.id }
  });
  await prisma.asignatura.create({
    data: { nombre: 'PostgreSQL', cuposDisponibles: 5, carreraId: software.id, docenteId: prof1.id }
  });
  await prisma.asignatura.create({
    data: { nombre: 'Adobe Illustrator', cuposDisponibles: 15, carreraId: diseno.id, docenteId: prof2.id }
  });

  // 5. Lista de 20 Estudiantes Reales
  const listaEstudiantes = [
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
    { nombre: 'Javier', apellido: 'Mendoza', activo: true, carreraId: software.id },
    { nombre: 'Gabriela', apellido: 'Rios', activo: true, carreraId: software.id },
    { nombre: 'Andrés', apellido: 'Calle', activo: false, carreraId: software.id },
    { nombre: 'Paola', apellido: 'Torres', activo: true, carreraId: diseno.id },
    { nombre: 'Fernando', apellido: 'Guaman', activo: true, carreraId: diseno.id },
    { nombre: 'Mónica', apellido: 'Sánchez', activo: true, carreraId: software.id },
    { nombre: 'Ricardo', apellido: 'Castro', activo: true, carreraId: diseno.id },
    { nombre: 'Verónica', apellido: 'Luna', activo: true, carreraId: software.id },
    { nombre: 'Patricio', apellido: 'Serrano', activo: false, carreraId: software.id },
    { nombre: 'Isabel', apellido: 'Díaz', activo: true, carreraId: diseno.id },
  ];

  console.log('📡 Insertando 20 registros de estudiantes...');
  for (const est of listaEstudiantes) {
    await prisma.estudiante.create({ data: est });
  }

  console.log('✅ Seed completado con éxito.');
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