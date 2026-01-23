import 'dotenv/config';
import { defineConfig } from '@prisma/config';

// ...
export default defineConfig({
  // ...
  datasource: {
    // Asegúrate que diga USUARIOS
    url: process.env.DATABASE_URL_USUARIOS ?? '', 
  },
});