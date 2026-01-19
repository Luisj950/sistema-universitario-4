-- CreateTable
CREATE TABLE "Estudiante" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,

    CONSTRAINT "Estudiante_pkey" PRIMARY KEY ("id")
);

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

    CONSTRAINT "Materia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inscripcion" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estudianteId" TEXT NOT NULL,
    "materiaId" TEXT NOT NULL,

    CONSTRAINT "Inscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Carrera_nombre_key" ON "Carrera"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Aula_nombre_key" ON "Aula"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Inscripcion_estudianteId_materiaId_key" ON "Inscripcion"("estudianteId", "materiaId");

-- AddForeignKey
ALTER TABLE "Titulo" ADD CONSTRAINT "Titulo_profesorId_fkey" FOREIGN KEY ("profesorId") REFERENCES "Profesor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materia" ADD CONSTRAINT "Materia_carreraId_fkey" FOREIGN KEY ("carreraId") REFERENCES "Carrera"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materia" ADD CONSTRAINT "Materia_profesorId_fkey" FOREIGN KEY ("profesorId") REFERENCES "Profesor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Materia" ADD CONSTRAINT "Materia_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "Aula"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Estudiante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "Materia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
