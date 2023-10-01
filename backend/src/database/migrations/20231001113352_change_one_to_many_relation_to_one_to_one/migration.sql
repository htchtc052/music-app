/*
  Warnings:

  - You are about to drop the column `isActive` on the `tracks_files` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[trackId]` on the table `tracks_files` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "tracks_files" DROP COLUMN "isActive";

-- CreateIndex
CREATE UNIQUE INDEX "tracks_files_trackId_key" ON "tracks_files"("trackId");
