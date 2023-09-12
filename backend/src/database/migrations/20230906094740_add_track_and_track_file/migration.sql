-- CreateTable
CREATE TABLE "tracks" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "isAdult" BOOLEAN NOT NULL DEFAULT false,
    "keywords" TEXT[],
    "description" TEXT,
    "hiddenDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,
    "fileId" INTEGER NOT NULL,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracks_files" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "bitrate" INTEGER,
    "fileSize" INTEGER DEFAULT 0,
    "duration" INTEGER,
    "storageId" TEXT,
    "mime" TEXT NOT NULL,
    "md5" TEXT,
    "trackId" INTEGER NOT NULL,

    CONSTRAINT "tracks_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tracks_fileId_key" ON "tracks"("fileId");

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "tracks_files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
