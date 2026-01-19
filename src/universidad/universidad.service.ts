import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UniversidadService {
  constructor(private prisma: PrismaService) {}

  // --- CRUD BÁSICO PARA CARRERAS ---
  async create(data: { nombre: string }) {
    return this.prisma.carrera.create({ data });
  }

  async findAll() {
    return this.prisma.carrera.findMany({ include: { estudiantes: true } });
  }

  // --- PARTE 1: CONSULTAS DERIVADAS ---
  async listarEstudiantesActivos() {
    return this.prisma.estudiante.findMany({
      where: { activo: true },
      include: { carrera: true },
    });
  }

  async obtenerMateriasPorCarrera(carreraId: string) {
    return this.prisma.materia.findMany({ where: { carreraId } });
  }

  async listarDocentesCargaAlta() {
    return this.prisma.docente.findMany({
      where: { asignaturas: { _count: { gt: 1 } } },
    });
  }

  // --- PARTE 2: OPERACIONES LÓGICAS ---
  async buscarEstudiantesFiltro(carreraId: string) {
    return this.prisma.estudiante.findMany({
      where: {
        AND: [
          { activo: true },
          { carreraId },
          { inscripciones: { some: { periodoId: '2026-A' } } },
        ],
      },
    });
  }

  async filtrarDocentesAvanzado() {
    return this.prisma.docente.findMany({
      where: {
        AND: [
          { tipoContrato: 'TIEMPO_COMPLETO' },
          {
            OR: [
              { asignaturas: { some: {} } },
              { NOT: { estado: 'INACTIVO' } },
            ],
          },
        ],
      },
    });
  }

  // --- PARTE 3: CONSULTA NATIVA SQL (Resuelve tu error actual) ---
  async obtenerReporteMatriculas() {
    return this.prisma.$queryRaw`
      SELECT e.nombre, c.nombre as "carrera", COUNT(i.id) as "totalMaterias"
      FROM "Estudiante" e
      JOIN "Carrera" c ON e."carreraId" = c.id
      JOIN "Inscripcion" i ON e.id = i."estudianteId"
      GROUP BY e.nombre, c.nombre
      ORDER BY "totalMaterias" DESC;
    `;
  }

  // --- PARTE 4: OPERACIÓN TRANSACCIONAL (ACID) ---
  async matricularEstudiante(estudianteId: string, asignaturaId: string) {
    return this.prisma.$transaction(async (tx) => {
      const estudiante = await tx.estudiante.findUnique({ where: { id: estudianteId } });
      if (!estudiante?.activo) throw new BadRequestException('Estudiante no activo');

      const asignatura = await tx.asignatura.findUnique({ where: { id: asignaturaId } });
      if (!asignatura || asignatura.cuposDisponibles <= 0) {
        throw new BadRequestException('Sin cupos disponibles');
      }

      const inscripcion = await tx.inscripcion.create({
        data: { estudianteId, asignaturaId, periodoId: '2026-A' },
      });

      await tx.asignatura.update({
        where: { id: asignaturaId },
        data: { cuposDisponibles: { decrement: 1 } },
      });

      return inscripcion;
    });
  }
}