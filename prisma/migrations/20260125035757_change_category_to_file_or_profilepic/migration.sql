/*
  Warnings:

  - The values [FILE] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('POFILEPIC', 'FOLDER');
ALTER TABLE "public"."DriveObj" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "DriveObj" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "public"."Category_old";
ALTER TABLE "DriveObj" ALTER COLUMN "category" SET DEFAULT 'FOLDER';
COMMIT;
