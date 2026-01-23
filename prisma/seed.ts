import { PrismaClient as ClienteUsuarios } from '@prisma/client-usuarios';
import { PrismaClient as ClienteProfesores } from '@prisma/client-profesores';
import { PrismaClient as ClienteCarreras } from '@prisma/client-carreras';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

// 👇 SOLUCIÓN REAL PARA PRISMA 7:
// Usamos "Adapters" para inyectar la conexión manualmente, 
// ya que 'datasources' y 'url' en schema están prohibidos.

// 1. Conexión Usuarios
const poolUsuarios = new Pool({ connectionString: process.env.DATABASE_URL_USUARIOS });
const adapterUsuarios = new PrismaPg(poolUsuarios);
const prismaUsuarios = new ClienteUsuarios({ adapter: adapterUsuarios });

// 2. Conexión Profesores
const poolProfesores = new Pool({ connectionString: process.env.DATABASE_URL_PROFESORES });
const adapterProfesores = new PrismaPg(poolProfesores);
const prismaProfesores = new ClienteProfesores({ adapter: adapterProfesores });

// 3. Conexión Carreras
const poolCarreras = new Pool({ connectionString: process.env.DATABASE_URL });
const adapterCarreras = new PrismaPg(poolCarreras);
const prismaCarreras = new ClienteCarreras({ adapter: adapterCarreras });

async function main() {
  console.log('🌱 Iniciando Seed con Adaptadores (Bypass)...');

  // --- LIMPIEZA ---
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

  // --- 1. CARRERAS ---
  console.log('🏗️ Creando Carreras...');
  const soft = await prismaCarreras.carrera.create({ data: { nombre: 'Software' } });
  const dis = await prismaCarreras.carrera.create({ data: { nombre: 'Diseño' } });

  // --- 2. DOCENTES ---
  console.log('👨‍🏫 Creando Docentes...');
  const prof1 = await prismaProfesores.docente.create({ 
    data: { nombre: 'Roberto Eras', tipoContrato: 'FULL', estado: 'ACTIVO' } 
  });
  const prof2 = await prismaProfesores.docente.create({ 
    data: { nombre: 'Maria Solano', tipoContrato: 'FULL', estado: 'ACTIVO' } 
  });

  // --- 3. ASIGNATURAS ---
  console.log('📚 Creando Asignaturas...');
  await prismaCarreras.asignatura.create({
    data: { nombre: 'NestJS', cuposDisponibles: 10, carreraId: soft.id, docenteId: prof1.id }
  });
  await prismaCarreras.asignatura.create({
    data: { nombre: 'Diseño UI', cuposDisponibles: 10, carreraId: dis.id, docenteId: prof2.id }
  });

  // --- 4. ESTUDIANTES ---
  console.log('🎓 Creando Estudiantes...');
  const pass = await bcrypt.hash('123456', 10);
  
  const estudiante = await prismaUsuarios.estudiante.create({
    data: {
      nombre: 'Luis',
      apellido: 'Jaramillo',
      email: 'luis.jaramillo@test.com',
      password: pass,
      activo: true,
      carreraId: soft.id
    }
  });

  console.log('✅ Seed finalizado.');
  console.log('🔑 Credenciales: luis.jaramillo@test.com / 123456');
}

main()
  .catch(e => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Cerramos los pools y las conexiones
    await prismaUsuarios.$disconnect();
    await prismaProfesores.$disconnect();
    await prismaCarreras.$disconnect();
    await poolUsuarios.end();
    await poolProfesores.end();
    await poolCarreras.end();
  });