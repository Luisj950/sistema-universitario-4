import { PrismaClient as ClienteUsuarios } from '@prisma/client-usuarios';
import { PrismaClient as ClienteProfesores } from '@prisma/client-profesores';
import { PrismaClient as ClienteCarreras } from '@prisma/client-carreras';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

// Configuración de Conexiones (Prisma 7)
const poolUsuarios = new Pool({ connectionString: process.env.DATABASE_URL_USUARIOS });
const prismaUsuarios = new ClienteUsuarios({ adapter: new PrismaPg(poolUsuarios) });

const poolProfesores = new Pool({ connectionString: process.env.DATABASE_URL_PROFESORES });
const prismaProfesores = new ClienteProfesores({ adapter: new PrismaPg(poolProfesores) });

const poolCarreras = new Pool({ connectionString: process.env.DATABASE_URL });
const prismaCarreras = new ClienteCarreras({ adapter: new PrismaPg(poolCarreras) });

async function main() {
  console.log('🌱 Iniciando Seed con datos masivos...');

  const pass = await bcrypt.hash('123456', 10);

  // --- 1. LIMPIEZA ---
  try {
    await prismaCarreras.inscripcion.deleteMany({});
    await prismaCarreras.asignatura.deleteMany({});
    await prismaCarreras.carrera.deleteMany({});
    await prismaProfesores.docente.deleteMany({});
    await prismaUsuarios.estudiante.deleteMany({});
    console.log('🧹 Limpieza completada.');
  } catch (e) {
    console.log('⚠️ Aviso limpieza:', e.message);
  }

  // --- 2. CARRERAS ---
  const soft = await prismaCarreras.carrera.create({ data: { nombre: 'Ingeniería de Software' } });
  const ciber = await prismaCarreras.carrera.create({ data: { nombre: 'Ciberseguridad' } });

  // --- 3. DOCENTES (Mezcla de Contratos y Estados) ---
  const profs = await Promise.all([
    prismaProfesores.docente.create({ data: { nombre: 'Roberto Eras', tipoContrato: 'TIEMPO_COMPLETO', estado: 'ACTIVO' } }),
    prismaProfesores.docente.create({ data: { nombre: 'Maria Solano', tipoContrato: 'TIEMPO_COMPLETO', estado: 'ACTIVO' } }),
    prismaProfesores.docente.create({ data: { nombre: 'Juan Pérez', tipoContrato: 'MEDIO_TIEMPO', estado: 'ACTIVO' } }),
    prismaProfesores.docente.create({ data: { nombre: 'Ana Martínez', tipoContrato: 'TIEMPO_COMPLETO', estado: 'INACTIVO' } }),
  ]);

  // --- 4. ASIGNATURAS ---
  const materias = await Promise.all([
    prismaCarreras.asignatura.create({ data: { nombre: 'NestJS Avanzado', cuposDisponibles: 15, carreraId: soft.id, docenteId: profs[0].id } }),
    prismaCarreras.asignatura.create({ data: { nombre: 'Arquitectura Cloud', cuposDisponibles: 10, carreraId: soft.id, docenteId: profs[1].id } }),
    prismaCarreras.asignatura.create({ data: { nombre: 'Hacking Ético', cuposDisponibles: 12, carreraId: ciber.id, docenteId: profs[2].id } }),
    prismaCarreras.asignatura.create({ data: { nombre: 'Redes Seguras', cuposDisponibles: 8, carreraId: ciber.id, docenteId: profs[0].id } }),
  ]);

  // --- 5. 10 ESTUDIANTES (Mezcla de activos e inactivos) ---
  const alumnosData = [
    { nombre: 'Luis', apellido: 'Jaramillo', email: 'luis@test.com', activo: true, carreraId: soft.id },
    { nombre: 'Carla', apellido: 'Mendoza', email: 'carla@test.com', activo: true, carreraId: soft.id },
    { nombre: 'Diego', apellido: 'Vaca', email: 'diego@test.com', activo: true, carreraId: ciber.id },
    { nombre: 'Elena', apellido: 'Reyes', email: 'elena@test.com', activo: false, carreraId: soft.id }, // Inactivo para pruebas
    { nombre: 'Fernando', apellido: 'Soto', email: 'fernando@test.com', activo: true, carreraId: soft.id },
    { nombre: 'Gabriela', apellido: 'Luna', email: 'gabriela@test.com', activo: true, carreraId: ciber.id },
    { nombre: 'Hugo', apellido: 'Paz', email: 'hugo@test.com', activo: true, carreraId: soft.id },
    { nombre: 'Isabel', apellido: 'Torres', email: 'isabel@test.com', activo: true, carreraId: ciber.id },
    { nombre: 'Jorge', apellido: 'Díaz', email: 'jorge@test.com', activo: false, carreraId: ciber.id }, // Inactivo
    { nombre: 'Karen', apellido: 'Vega', email: 'karen@test.com', activo: true, carreraId: soft.id },
  ];

  for (const data of alumnosData) {
    await prismaUsuarios.estudiante.create({
      data: { ...data, password: pass }
    });
  }

  console.log('✅ Seed finalizado con 10 estudiantes y 4 docentes.');
}

main()
  .catch(e => { console.error('❌ Error:', e); process.exit(1); })
  .finally(async () => {
    await prismaUsuarios.$disconnect();
    await prismaProfesores.$disconnect();
    await prismaCarreras.$disconnect();
    await poolUsuarios.end();
    await poolProfesores.end();
    await poolCarreras.end();
  });