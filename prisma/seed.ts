import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

// 1. Configuramos el Pool y el Adaptador (Igual que en tu PrismaService)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando carga de datos (Seed)...');

  // 2. Crear Carrera (Usando upsert para no duplicar si ya existe)
  const carrera = await prisma.carrera.upsert({
    where: { nombre: 'Ingeniería en Sistemas' },
    update: {},
    create: { nombre: 'Ingeniería en Sistemas' },
  });

  // 3. Crear Estudiante vinculado
  await prisma.estudiante.upsert({
    where: { id: 'seed-estudiante-1' },
    update: {},
    create: {
      id: 'seed-estudiante-1',
      nombre: 'Luis',
      apellido: 'Alberto',
      carreraId: carrera.id,
    },
  });

  // 4. Crear Usuario Admin (Requisito de la tarea)
  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: '123', 
      nombre: 'Luis Administrador',
      roles: ['admin'],
    },
  });

  console.log('✅ Seed completado con éxito.');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });