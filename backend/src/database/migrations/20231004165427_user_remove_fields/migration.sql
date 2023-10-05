/*
  Warnings:

  - You are about to drop the column `hiddenDescription` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `private` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "hiddenDescription",
DROP COLUMN "private",
ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;
