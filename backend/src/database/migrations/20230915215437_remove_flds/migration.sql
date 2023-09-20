/*
  Warnings:

  - You are about to drop the column `isAdult` on the `tracks` table. All the data in the column will be lost.
  - You are about to drop the column `bitrate` on the `tracks_files` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tracks" DROP COLUMN "isAdult";

-- AlterTable
ALTER TABLE "tracks_files" DROP COLUMN "bitrate";
