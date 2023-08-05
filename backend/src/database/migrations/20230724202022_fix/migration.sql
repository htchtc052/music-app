/*
  Warnings:

  - You are about to drop the column `slug` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_slug_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "slug";
