/*
  Warnings:

  - You are about to drop the `Profesor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Titulo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Titulo" DROP CONSTRAINT "Titulo_profesorId_fkey";

-- DropTable
DROP TABLE "Profesor";

-- DropTable
DROP TABLE "Titulo";

-- CreateTable
CREATE TABLE "Carrera" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Carrera_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aula" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Aula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Materia" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "carreraId" TEXT NOT NULL,
    "profesorId" TEXT NOT NULL,
    "aulaId" TEXT NOT NULL,
    "cicloId" TEXT,

    CONSTRAINT "Materia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estudiante" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "carreraId" TEXT NOT NULL,

    CONSTRAINT "Estudiante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inscripcion" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estudianteId" TEXT NOT NULL,
    "materiaId" TEXT NOT NULL,

    CONSTRAINT "Inscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Periodo" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Periodo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ciclo" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Ciclo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Matricula" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estudianteId" TEXT NOT NULL,
    "periodoId" TEXT NOT NULL,

    CONSTRAINT "Matricula_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Carrera_nombre_key" ON "Carrera"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Aula_nombre_key" ON "Aula"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Inscripcion_estudianteId_materiaId_key" ON "Inscripcion"("estudianteId", "materiaId");

-- CreateIndex
CREATE UNIQUE INDEX "Matricula_estudianteId_periodoId_key" ON "Matricula"("estudianteId", "periodoId");

-- AddForeignKey
ALTER TABLE "Materia" ADD CONSTRAINT "Materia_carreraId_fkey" FOREIGN KEY ("carreraId") REFERENCES "Carrera"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materia" ADD CONSTRAINT "Materia_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "Aula"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materia" ADD CONSTRAINT "Materia_cicloId_fkey" FOREIGN KEY ("cicloId") REFERENCES "Ciclo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estudiante" ADD CONSTRAINT "Estudiante_carreraId_fkey" FOREIGN KEY ("carreraId") REFERENCES "Carrera"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Estudiante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "Materia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Estudiante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_periodoId_fkey" FOREIGN KEY ("periodoId") REFERENCES "Periodo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
