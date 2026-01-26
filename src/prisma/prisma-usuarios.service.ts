import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client-usuarios'; // 👈 Cliente específico
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaUsuariosService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const url = process.env.DATABASE_URL_USUARIOS;

    // 🚩 LOG DE DIAGNÓSTICO
    console.log('-------------------------------------------');
    console.log('🔑 URL USUARIOS:', url ? '✅ CARGADA' : '❌ INDEFINIDA (VACÍA)');
    console.log('-------------------------------------------');

    const pool = new Pool({ connectionString: url });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}