/*
  Warnings:

  - You are about to drop the `Aula` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ciclo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inscripcion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Materia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Matricula` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Periodo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Inscripcion" DROP CONSTRAINT "Inscripcion_estudianteId_fkey";

-- DropForeignKey
ALTER TABLE "Inscripcion" DROP CONSTRAINT "Inscripcion_materiaId_fkey";

-- DropForeignKey
ALTER TABLE "Materia" DROP CONSTRAINT "Materia_aulaId_fkey";

-- DropForeignKey
ALTER TABLE "Materia" DROP CONSTRAINT "Materia_carreraId_fkey";

-- DropForeignKey
ALTER TABLE "Materia" DROP CONSTRAINT "Materia_cicloId_fkey";

-- DropForeignKey
ALTER TABLE "Matricula" DROP CONSTRAINT "Matricula_estudianteId_fkey";

-- DropForeignKey
ALTER TABLE "Matricula" DROP CONSTRAINT "Matricula_periodoId_fkey";

-- DropTable
DROP TABLE "Aula";

-- DropTable
DROP TABLE "Ciclo";

-- DropTable
DROP TABLE "Inscripcion";

-- DropTable
DROP TABLE "Materia";

-- DropTable
DROP TABLE "Matricula";

-- DropTable
DROP TABLE "Periodo";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "roles" TEXT[] DEFAULT ARRAY['user']::TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profesor" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,

    CONSTRAINT "Profesor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
