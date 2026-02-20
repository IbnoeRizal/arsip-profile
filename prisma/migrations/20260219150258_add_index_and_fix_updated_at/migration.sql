/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Jabatan` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "DriveObj" ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "Kelas" ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Misi" ALTER COLUMN "order" SET DEFAULT 0,
ALTER COLUMN "order" DROP DEFAULT;
DROP SEQUENCE "Misi_order_seq";

-- CreateIndex
CREATE INDEX "DriveObj_userId_category_idx" ON "DriveObj"("userId", "category");

-- CreateIndex
CREATE UNIQUE INDEX "Jabatan_title_key" ON "Jabatan"("title");

-- CreateIndex
CREATE INDEX "User_name_jabatanId_idx" ON "User"("name", "jabatanId");
