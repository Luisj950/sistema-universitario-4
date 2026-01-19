import { defineConfig } from '@prisma/config';
import 'dotenv/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    // Probamos quitando el './' para asegurar compatibilidad en Windows
    seed: 'ts-node prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});