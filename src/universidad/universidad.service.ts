import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaUsuariosService } from '../prisma/prisma-usuarios.service';
import { PrismaCarrerasService } from '../prisma/prisma-carreras.service';
import { PrismaProfesoresService } from '../prisma/prisma-profesores.service';

@Injectable()
export class UniversidadService {
  constructor(
    private prismaUsuarios: PrismaUsuariosService,
    private prismaProfesores: PrismaProfesoresService,
    private prismaCarreras: PrismaCarrerasService,
  ) {}

  // --- MÉTODOS REQUERIDOS POR CARRERAS CONTROLLER ---
  async create(data: any) {
    return this.prismaCarreras.carrera.create({ data });
  }

  async findAll() {
    return this.prismaCarreras.carrera.findMany();
  }

  // --- PARTE 1: CONSULTAS DERIVADAS ---
  // src/universidad/universidad.service.ts

async listarEstudiantesActivos() {
  // 1. Obtenemos solo los estudiantes que cumplen la condición de integridad
  const estudiantes = await this.prismaUsuarios.estudiante.findMany({
    where: { activo: true },
  });

  // 2. Traemos todas las carreras para el mapeo
  const carreras = await this.prismaCarreras.carrera.findMany();

  // 3. Retornamos la unión de datos (Join en memoria)
  return estudiantes.map(est => ({
    ...est,
    nombreCarrera: carreras.find(c => c.id === est.carreraId)?.nombre || 'Sin Carrera'
  }));
}
  // Este método responde a listarAsignaturas() en el Controller
  async findAllAsignaturas() {
    return this.prismaCarreras.asignatura.findMany({
      include: { carrera: true }
    });
  }

  async obtenerAsignaturasPorCarrera(carreraId: string) {
    return this.prismaCarreras.asignatura.findMany({ where: { carreraId } });
  }

  // --- PARTE 2: OPERADORES LÓGICOS (AND, OR, NOT) ---

  /**
   * Filtrar docentes: Tiempo Completo AND (Dictan materias OR NOT Inactivos)
   */
  async listarDocentesCargaAlta() {
    // Obtenemos IDs de docentes que tienen materias asignadas
    const asignaturas = await this.prismaCarreras.asignatura.findMany({
      where: { docenteId: { not: null } },
      select: { docenteId: true }
    });
    const idsConMaterias = [...new Set(asignaturas.map(a => a.docenteId))];

    return this.prismaProfesores.docente.findMany({
      where: {
        AND: [
          { tipoContrato: 'TIEMPO_COMPLETO' }, // Operador AND
          {
            OR: [ // Operador OR
              { id: { in: idsConMaterias as string[] } },
              { NOT: { estado: 'INACTIVO' } } // Operador NOT
            ]
          }
        ]
      }
    });
  }

  /**
   * Buscar inscripciones: Estudiante AND Período
   */
  async listarMatriculasEstudiante(estudianteId: string, periodoId: string) {
    return this.prismaCarreras.inscripcion.findMany({
      where: {
        AND: [
          { estudianteId: estudianteId },
          { periodoId: periodoId }
        ]
      },
      include: { asignatura: true }
    });
  }

  // --- PARTE 3: CONSULTA NATIVA SQL ---
  async obtenerReporteMatriculas() {
    // Uso de SQL Nativo en Prisma 7 para agregación
    const estadisticas: any[] = await this.prismaCarreras.$queryRaw`
      SELECT "estudianteId", COUNT(*) as "totalMaterias"
      FROM "Inscripcion"
      GROUP BY "estudianteId"
    `;

    const estudiantes = await this.prismaUsuarios.estudiante.findMany();
    const carreras = await this.prismaCarreras.carrera.findMany();

    const reporte = estadisticas.map(stat => {
      const est = estudiantes.find(e => e.id === stat.estudianteId);
      const carrera = carreras.find(c => c.id === est?.carreraId);
      
      return {
        nombre: est?.nombre || 'Desconocido',
        carrera: carrera?.nombre || 'N/A',
        totalMaterias: Number(stat.totalMaterias)
      };
    });

    return reporte.sort((a, b) => b.totalMaterias - a.totalMaterias);
  }

  // --- PARTE 4: OPERACIÓN TRANSACCIONAL (ACID) ---
  async matricularEstudiante(estudianteId: string, asignaturaId: string) {
    const estudiante = await this.prismaUsuarios.estudiante.findUnique({ 
        where: { id: estudianteId } 
    });
    
    if (!estudiante?.activo) {
        throw new BadRequestException('El estudiante debe estar activo para matricularse');
    }

    // El $transaction asegura la Atomicidad (Todo o nada)
    return this.prismaCarreras.$transaction(async (tx) => {
      const asignatura = await tx.asignatura.findUnique({ 
          where: { id: asignaturaId } 
      });
      
      if (!asignatura || asignatura.cuposDisponibles <= 0) {
        throw new BadRequestException('La asignatura no existe o no tiene cupos disponibles');
      }

      // 1. Crear la inscripción
      const inscripcion = await tx.inscripcion.create({
        data: { 
            estudianteId, 
            asignaturaId, 
            periodoId: '2026-A' 
        },
      });

      // 2. Restar el cupo
      await tx.asignatura.update({
        where: { id: asignaturaId },
        data: { cuposDisponibles: { decrement: 1 } },
      });

      return inscripcion;
    });
  }
}