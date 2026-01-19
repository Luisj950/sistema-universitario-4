import { defineConfig } from '@prisma/config';
import 'dotenv/config';

export default defineConfig({
  // Prisma 7 requiere la ruta al esquema para evitar errores de validación
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
});