/*
  Warnings:

  - You are about to drop the column `nf1` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `nf2` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `nf3` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `nfld` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "nf1",
DROP COLUMN "nf2",
DROP COLUMN "nf3",
DROP COLUMN "nfld";
