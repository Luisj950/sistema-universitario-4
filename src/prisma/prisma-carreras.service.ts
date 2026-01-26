import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client-carreras';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaCarrerasService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Nota: Aquí usamos DATABASE_URL que es la de carreras en tu .env
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    super({ adapter }); // Forzamos a que use la BD de CARRERAS
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}