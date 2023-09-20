/*
  Warnings:

  - Added the required column `filePath` to the `tracks_files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tracks_files" ADD COLUMN     "filePath" TEXT NOT NULL;
