/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Profesor" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,

    CONSTRAINT "Profesor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Titulo" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "profesorId" TEXT NOT NULL,

    CONSTRAINT "Titulo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Titulo" ADD CONSTRAINT "Titulo_profesorId_fkey" FOREIGN KEY ("profesorId") REFERENCES "Profesor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
