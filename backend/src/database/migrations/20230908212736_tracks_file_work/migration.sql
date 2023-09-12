/*
  Warnings:

  - You are about to drop the column `storageId` on the `tracks_files` table. All the data in the column will be lost.
  - Made the column `bitrate` on table `tracks_files` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fileSize` on table `tracks_files` required. This step will fail if there are existing NULL values in that column.
  - Made the column `duration` on table `tracks_files` required. This step will fail if there are existing NULL values in that column.
  - Made the column `md5` on table `tracks_files` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "tracks_files" DROP COLUMN "storageId",
ALTER COLUMN "bitrate" SET NOT NULL,
ALTER COLUMN "bitrate" SET DEFAULT 0,
ALTER COLUMN "fileSize" SET NOT NULL,
ALTER COLUMN "duration" SET NOT NULL,
ALTER COLUMN "duration" SET DEFAULT 0,
ALTER COLUMN "md5" SET NOT NULL;
