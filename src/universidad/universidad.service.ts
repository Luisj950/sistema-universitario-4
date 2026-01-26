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

  // 1. Listar todos los estudiantes activos junto con su carrera
  async listarEstudiantesActivos() {
    const estudiantes = await this.prismaUsuarios.estudiante.findMany({
      where: { activo: true },
    });

    const carreras = await this.prismaCarreras.carrera.findMany();

    return estudiantes.map(est => ({
      ...est,
      nombreCarrera: carreras.find(c => c.id === est.carreraId)?.nombre || 'Sin Carrera'
    }));
  }

  // 2. Obtener las materias asociadas a una carrera específica
  async obtenerAsignaturasPorCarrera(carreraId: string) {
    return this.prismaCarreras.asignatura.findMany({ where: { carreraId } });
  }

  // 3. Listar los docentes que imparten más de una asignatura
  async listarDocentesMultiAsignatura() {
    const asignaturas = await this.prismaCarreras.asignatura.findMany({
      where: { docenteId: { not: null } },
    });

    // Contamos asignaturas por docente
    const conteo = asignaturas.reduce((acc, asig) => {
      acc[asig.docenteId] = (acc[asig.docenteId] || 0) + 1;
      return acc;
    }, {});

    // Filtramos IDs de docentes con más de 1 asignatura
    const idsDocentes = Object.keys(conteo).filter(id => conteo[id] > 1);

    return this.prismaProfesores.docente.findMany({
      where: { id: { in: idsDocentes } }
    });
  }

  // 4. Mostrar las matrículas de un estudiante en un período determinado
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

  // Este método responde a listarAsignaturas() en el Controller
  async findAllAsignaturas() {
    return this.prismaCarreras.asignatura.findMany({
      include: { carrera: true }
    });
  }

  // --- PARTE 2: OPERADORES LÓGICOS (AND, OR, NOT) ---

  /**
   * Buscar estudiantes: Activos AND Carrera AND Matrícula en período
   */
  async buscarEstudiantesAvanzado(carreraId: string, periodoId: string) {
    // Obtenemos IDs de estudiantes inscritos en ese período
    const inscripciones = await this.prismaCarreras.inscripcion.findMany({
      where: { periodoId: periodoId },
      select: { estudianteId: true }
    });
    const idsInscritos = inscripciones.map(i => i.estudianteId);

    return this.prismaUsuarios.estudiante.findMany({
      where: {
        AND: [
          { activo: true },
          { carreraId: carreraId },
          { id: { in: idsInscritos } }
        ]
      }
    });
  }

  /**
   * Filtrar docentes: Tiempo Completo AND (Dictan materias OR NOT Inactivos)
   */
  async listarDocentesCargaAlta() {
    const asignaturas = await this.prismaCarreras.asignatura.findMany({
      where: { docenteId: { not: null } },
      select: { docenteId: true }
    });
    const idsConMaterias = [...new Set(asignaturas.map(a => a.docenteId))];

    return this.prismaProfesores.docente.findMany({
      where: {
        AND: [
          { tipoContrato: 'TIEMPO_COMPLETO' },
          {
            OR: [
              { id: { in: idsConMaterias as string[] } },
              { NOT: { estado: 'INACTIVO' } }
            ]
          }
        ]
      }
    });
  }

  // --- PARTE 3: CONSULTA NATIVA SQL ---
  async obtenerReporteMatriculas() {
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

      // 1. Registrar la matrícula (Inscripción)
      const inscripcion = await tx.inscripcion.create({
        data: { 
            estudianteId, 
            asignaturaId, 
            periodoId: '2026-A' 
        },
      });

      // 2. Descontar el cupo disponible de la asignatura
      await tx.asignatura.update({
        where: { id: asignaturaId },
        data: { cuposDisponibles: { decrement: 1 } },
      });

      return inscripcion;
    });
  }
}