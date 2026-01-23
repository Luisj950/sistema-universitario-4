import 'dotenv/config';
import { defineConfig } from '@prisma/config';

export default defineConfig({
  // ...
  datasource: {
    // 👇 CAMBIA ESTO
    url: process.env.DATABASE_URL_PROFESORES ?? '', 
  },
});