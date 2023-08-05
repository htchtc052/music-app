/*
  Warnings:

  - Added the required column `nf2` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nf3` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "nf1" TEXT,
ADD COLUMN     "nf2" TEXT NOT NULL,
ADD COLUMN     "nf3" TEXT NOT NULL;
