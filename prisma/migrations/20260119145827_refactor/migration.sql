/*
  Warnings:

  - You are about to drop the column `Link` on the `DriveObj` table. All the data in the column will be lost.
  - You are about to drop the column `Useremail` on the `DriveObj` table. All the data in the column will be lost.
  - The `category` column on the `DriveObj` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[useremail]` on the table `DriveObj` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jabatanId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('FILE', 'FOLDER');

-- DropForeignKey
ALTER TABLE "DriveObj" DROP CONSTRAINT "DriveObj_Useremail_fkey";

-- DropIndex
DROP INDEX "DriveObj_Useremail_key";

-- AlterTable
ALTER TABLE "DriveObj" DROP COLUMN "Link",
DROP COLUMN "Useremail",
ADD COLUMN     "link" TEXT,
ADD COLUMN     "useremail" TEXT,
DROP COLUMN "category",
ADD COLUMN     "category" "Category" NOT NULL DEFAULT 'FOLDER';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "jabatanId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "category";

-- CreateTable
CREATE TABLE "Jabatan" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Jabatan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DriveObj_useremail_key" ON "DriveObj"("useremail");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_jabatanId_fkey" FOREIGN KEY ("jabatanId") REFERENCES "Jabatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriveObj" ADD CONSTRAINT "DriveObj_useremail_fkey" FOREIGN KEY ("useremail") REFERENCES "User"("email") ON DELETE SET NULL ON UPDATE CASCADE;
