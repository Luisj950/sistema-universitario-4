import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // 1. Creamos el pool de conexiones usando el driver estándar 'pg'
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    // 2. Creamos el adaptador de Prisma para PostgreSQL
    const adapter = new PrismaPg(pool);

    // 3. Pasamos el adaptador al constructor de PrismaClient
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Conectado con éxito usando Prisma 7 + Adaptador PG');
    } catch (error) {
      console.error('❌ Error de conexión:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}