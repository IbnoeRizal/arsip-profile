-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "category" AS ENUM ('Image', 'File');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "Bio" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriveObj" (
    "id" TEXT NOT NULL,
    "Link" TEXT,
    "Useremail" TEXT,
    "category" "category" NOT NULL DEFAULT 'File',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DriveObj_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DriveObj_Useremail_key" ON "DriveObj"("Useremail");

-- AddForeignKey
ALTER TABLE "DriveObj" ADD CONSTRAINT "DriveObj_Useremail_fkey" FOREIGN KEY ("Useremail") REFERENCES "User"("email") ON DELETE SET NULL ON UPDATE CASCADE;
