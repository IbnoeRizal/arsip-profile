/*
  Warnings:

  - You are about to drop the column `useremail` on the `DriveObj` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `DriveObj` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "DriveObj" DROP CONSTRAINT "DriveObj_useremail_fkey";

-- DropIndex
DROP INDEX "DriveObj_useremail_key";

-- AlterTable
ALTER TABLE "DriveObj" DROP COLUMN "useremail",
ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "DriveObj_userId_key" ON "DriveObj"("userId");

-- AddForeignKey
ALTER TABLE "DriveObj" ADD CONSTRAINT "DriveObj_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE SET NULL;
