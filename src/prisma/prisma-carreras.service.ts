import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaCarrerasService extends PrismaService {}
