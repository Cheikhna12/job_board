-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PUBLISHED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "status" "JobStatus" NOT NULL DEFAULT 'PUBLISHED';
