import 'dotenv/config';
import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: 'schema.prisma',
  datasource: {
    // 👇 Para Carreras, usamos la variable genérica según tu .env
    url: process.env.DATABASE_URL ?? '', 
  },
});