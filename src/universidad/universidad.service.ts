import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UniversidadService {
  constructor(private prisma: PrismaService) {}

  // --- CRUD BÁSICO ---
  async create(data: { nombre: string }) {
    return this.prisma.carrera.create({ data });
  }

  async findAll() {
    return this.prisma.carrera.findMany({ include: { estudiantes: true } });
  }

  async findAllAsignaturas() {
    return this.prisma.asignatura.findMany({ include: { docente: true, carrera: true } });
  }

  // --- PARTE 1: CONSULTAS DERIVADAS ---
  async listarEstudiantesActivos() {
    return this.prisma.estudiante.findMany({
      where: { activo: true },
      include: { carrera: true },
    });
  }

  async obtenerAsignaturasPorCarrera(carreraId: string) {
    return this.prisma.asignatura.findMany({ where: { carreraId } });
  }

  // SOLUCIÓN AL ERROR DE VALIDACIÓN: Filtramos en memoria
  async listarDocentesCargaAlta() {
    const docentes = await this.prisma.docente.findMany({
      include: {
        _count: {
          select: { asignaturas: true },
        },
      },
    });

    // Retorna solo los docentes que tienen más de 1 asignatura
    return docentes.filter((docente) => docente._count.asignaturas > 1);
  }

  async listarMatriculasEstudiante(estudianteId: string, periodoId: string) {
    return this.prisma.inscripcion.findMany({
      where: { estudianteId, periodoId },
      include: { asignatura: true },
    });
  }

  // --- PARTE 3: CONSULTA NATIVA SQL ---
  async obtenerReporteMatriculas() {
    return this.prisma.$queryRaw`
      SELECT e.nombre, c.nombre as "carrera", CAST(COUNT(i.id) AS INTEGER) as "totalMaterias"
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
      if (!estudiante?.activo) throw new BadRequestException('Estudiante no activo o inexistente');

      const asignatura = await tx.asignatura.findUnique({ where: { id: asignaturaId } });
      if (!asignatura) throw new BadRequestException('Asignatura no encontrada');
      if (asignatura.cuposDisponibles <= 0) throw new BadRequestException('Sin cupos');

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