/*
  Warnings:

  - You are about to drop the `Profesor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Titulo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Materia" DROP CONSTRAINT "Materia_profesorId_fkey";

-- DropForeignKey
ALTER TABLE "Titulo" DROP CONSTRAINT "Titulo_profesorId_fkey";

-- AlterTable
ALTER TABLE "Materia" ADD COLUMN     "cicloId" TEXT;

-- DropTable
DROP TABLE "Profesor";

-- DropTable
DROP TABLE "Titulo";

-- DropTable
DROP TABLE "User";

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
CREATE UNIQUE INDEX "Matricula_estudianteId_periodoId_key" ON "Matricula"("estudianteId", "periodoId");

-- AddForeignKey
ALTER TABLE "Materia" ADD CONSTRAINT "Materia_cicloId_fkey" FOREIGN KEY ("cicloId") REFERENCES "Ciclo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Estudiante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matricula" ADD CONSTRAINT "Matricula_periodoId_fkey" FOREIGN KEY ("periodoId") REFERENCES "Periodo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
