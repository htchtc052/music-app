/*
  Warnings:

  - You are about to drop the column `fileId` on the `tracks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tracks" DROP CONSTRAINT "tracks_fileId_fkey";

-- DropIndex
DROP INDEX "tracks_fileId_key";

-- AlterTable
ALTER TABLE "tracks" DROP COLUMN "fileId";

-- AddForeignKey
ALTER TABLE "tracks_files" ADD CONSTRAINT "tracks_files_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
