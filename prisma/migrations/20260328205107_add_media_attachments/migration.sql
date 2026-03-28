-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('AUDIO', 'VIDEO');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "coverImageUrl" TEXT;

-- CreateTable
CREATE TABLE "MediaAttachment" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAttachment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MediaAttachment" ADD CONSTRAINT "MediaAttachment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
