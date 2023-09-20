/*
  Warnings:

  - You are about to drop the column `mime` on the `tracks_files` table. All the data in the column will be lost.
  - Added the required column `mimetype` to the `tracks_files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tracks_files" DROP COLUMN "mime",
ADD COLUMN     "mimetype" TEXT NOT NULL;
