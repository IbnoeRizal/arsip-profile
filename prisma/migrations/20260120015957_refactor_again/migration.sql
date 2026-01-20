/*
  Warnings:

  - You are about to drop the column `Bio` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "Bio",
ADD COLUMN     "bio" TEXT;

-- CreateTable
CREATE TABLE "Mengajar" (
    "id" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,
    "idKelas" TEXT NOT NULL,
    "idMapel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mengajar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kelas" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kelas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mapel" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mapel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mengajar_idUser_idKelas_idMapel_key" ON "Mengajar"("idUser", "idKelas", "idMapel");

-- CreateIndex
CREATE UNIQUE INDEX "Kelas_nama_key" ON "Kelas"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "Mapel_nama_key" ON "Mapel"("nama");

-- AddForeignKey
ALTER TABLE "Mengajar" ADD CONSTRAINT "Mengajar_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mengajar" ADD CONSTRAINT "Mengajar_idKelas_fkey" FOREIGN KEY ("idKelas") REFERENCES "Kelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mengajar" ADD CONSTRAINT "Mengajar_idMapel_fkey" FOREIGN KEY ("idMapel") REFERENCES "Mapel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
