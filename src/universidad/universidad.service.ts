import { Injectable, BadRequestException } from '@nestjs/common';
// Importamos los 3 servicios específicos que creamos
import { PrismaUsuariosService } from '../prisma/prisma-usuarios.service';
import { PrismaCarrerasService } from '../prisma/prisma-carreras.service';
import { PrismaProfesoresService } from '../prisma/prisma-profesores.service';

@Injectable()
export class UniversidadService {
  // ✅ SOLUCIÓN: Un solo constructor inyectando los 3 servicios
  constructor(
    private prismaUsuarios: PrismaUsuariosService,
    private prismaProfesores: PrismaProfesoresService,
    private prismaCarreras: PrismaCarrerasService,
  ) {}

  // --- CRUD BÁSICO ---
  async create(data: { nombre: string }) {
    // Usamos el servicio de Carreras
    return this.prismaCarreras.carrera.create({ data });
  }

  async findAll() {
    // ⚠️ NOTA: Ya no podemos hacer "include: { estudiantes: true }" porque están en otra BD.
    // Solo devolvemos las carreras.
    return this.prismaCarreras.carrera.findMany();
  }

  async findAllAsignaturas() {
    // Asignatura y Carrera están en la misma BD, así que "include: { carrera: true }" SI funciona.
    // Pero Docente está en otra BD, así que quitamos "docente: true" del include.
    return this.prismaCarreras.asignatura.findMany({
      include: { 
        carrera: true 
        // docente: true <--- Esto se quita porque docente está en otra base de datos
      } 
    });
  }

  // --- PARTE 1: CONSULTAS DERIVADAS ---
  async listarEstudiantesActivos() {
    // Usamos prismaUsuarios
    const estudiantes = await this.prismaUsuarios.estudiante.findMany({
      where: { activo: true },
      // include: { carrera: true } <--- NO SE PUEDE (Carrera está en otra BD)
    });
    return estudiantes;
  }

  async obtenerAsignaturasPorCarrera(carreraId: string) {
    // Usamos prismaCarreras
    return this.prismaCarreras.asignatura.findMany({ where: { carreraId } });
  }

  // SOLUCIÓN AL ERROR DE VALIDACIÓN: Filtramos en memoria
  async listarDocentesCargaAlta() {
    // 1. Obtenemos todas las asignaturas de la BD Carreras
    const asignaturas = await this.prismaCarreras.asignatura.findMany({
      where: { docenteId: { not: null } }
    });

    // 2. Contamos cuántas materias tiene cada docenteId (Lógica en JS)
    const conteo = asignaturas.reduce((acc, curr) => {
      const id = curr.docenteId;
      if (id) acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 3. Filtramos los IDs que tienen más de 1 materia
    const docentesIdsAltaCarga = Object.keys(conteo).filter(id => conteo[id] > 1);

    // 4. Buscamos esos docentes en la BD Profesores
    if (docentesIdsAltaCarga.length === 0) return [];
    
    return this.prismaProfesores.docente.findMany({
      where: {
        id: { in: docentesIdsAltaCarga }
      }
    });
  }

  async listarMatriculasEstudiante(estudianteId: string, periodoId: string) {
    // Inscripción y Asignatura están en la misma BD (Carreras), el include funciona
    return this.prismaCarreras.inscripcion.findMany({
      where: { estudianteId, periodoId },
      include: { asignatura: true },
    });
  }

  // --- PARTE 3: CONSULTA NATIVA SQL ---
  async obtenerReporteMatriculas() {
    // ⚠️ ALERTA: No se pueden hacer JOINs SQL entre bases de datos diferentes.
    // Debemos hacerlo por código:
    
    // 1. Obtener todas las inscripciones
    const inscripciones = await this.prismaCarreras.inscripcion.findMany({
      include: { asignatura: { include: { carrera: true } } }
    });

    // 2. Obtener nombres de estudiantes (BD Usuarios)
    const estudiantesIds = [...new Set(inscripciones.map(i => i.estudianteId))];
    const estudiantes = await this.prismaUsuarios.estudiante.findMany({
      where: { id: { in: estudiantesIds } },
      select: { id: true, nombre: true }
    });

    // 3. Unir datos en JS (Mapeo)
    const reporte = estudiantes.map(est => {
        const susInscripciones = inscripciones.filter(i => i.estudianteId === est.id);
        const carreraNombre = susInscripciones[0]?.asignatura?.carrera?.nombre || 'Sin Carrera';
        
        return {
            nombre: est.nombre,
            carrera: carreraNombre,
            totalMaterias: susInscripciones.length
        };
    });

    return reporte.sort((a, b) => b.totalMaterias - a.totalMaterias);
  }

  // --- PARTE 4: OPERACIÓN TRANSACCIONAL (ACID SIMULADO) ---
  async matricularEstudiante(estudianteId: string, asignaturaId: string) {
    // Paso 1: Verificar estudiante en BD Usuarios
    const estudiante = await this.prismaUsuarios.estudiante.findUnique({ 
        where: { id: estudianteId } 
    });
    if (!estudiante?.activo) throw new BadRequestException('Estudiante no activo o inexistente');

    // Paso 2: Transacción en BD Carreras (Asignatura + Inscripción)
    return this.prismaCarreras.$transaction(async (tx) => {
      const asignatura = await tx.asignatura.findUnique({ where: { id: asignaturaId } });
      
      if (!asignatura) throw new BadRequestException('Asignatura no encontrada');
      if (asignatura.cuposDisponibles <= 0) throw new BadRequestException('Sin cupos');

      // Crear inscripción
      const inscripcion = await tx.inscripcion.create({
        data: { 
            estudianteId, // Solo guardamos el ID string
            asignaturaId, 
            periodoId: '2026-A' 
        },
      });

      // Restar cupo
      await tx.asignatura.update({
        where: { id: asignaturaId },
        data: { cuposDisponibles: { decrement: 1 } },
      });

      return inscripcion;
    });
  }
}