import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env') });

export default defineConfig({
  schema: './schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL, 
  },
});