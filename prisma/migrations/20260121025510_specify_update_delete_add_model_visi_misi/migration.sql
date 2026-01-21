-- DropForeignKey
ALTER TABLE "DriveObj" DROP CONSTRAINT "DriveObj_useremail_fkey";

-- DropForeignKey
ALTER TABLE "Mengajar" DROP CONSTRAINT "Mengajar_idKelas_fkey";

-- DropForeignKey
ALTER TABLE "Mengajar" DROP CONSTRAINT "Mengajar_idMapel_fkey";

-- DropForeignKey
ALTER TABLE "Mengajar" DROP CONSTRAINT "Mengajar_idUser_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_jabatanId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "jabatanId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Visi" (
    "id" TEXT NOT NULL,
    "vision" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Misi" (
    "id" TEXT NOT NULL,
    "order" SERIAL NOT NULL,
    "mision" TEXT NOT NULL,
    "idVisi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Misi_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_jabatanId_fkey" FOREIGN KEY ("jabatanId") REFERENCES "Jabatan"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "DriveObj" ADD CONSTRAINT "DriveObj_useremail_fkey" FOREIGN KEY ("useremail") REFERENCES "User"("email") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "Mengajar" ADD CONSTRAINT "Mengajar_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mengajar" ADD CONSTRAINT "Mengajar_idKelas_fkey" FOREIGN KEY ("idKelas") REFERENCES "Kelas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mengajar" ADD CONSTRAINT "Mengajar_idMapel_fkey" FOREIGN KEY ("idMapel") REFERENCES "Mapel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Misi" ADD CONSTRAINT "Misi_idVisi_fkey" FOREIGN KEY ("idVisi") REFERENCES "Visi"("id") ON DELETE CASCADE ON UPDATE CASCADE;
