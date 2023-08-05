/*
  Warnings:

  - Added the required column `testFld` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `testFld1` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "testFld" TEXT NOT NULL,
ADD COLUMN     "testFld1" BIGINT NOT NULL;
