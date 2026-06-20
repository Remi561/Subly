-- CreateEnum
CREATE TYPE "Type" AS ENUM ('CREATED', 'EDITED', 'RENEWED');

-- AlterTable
ALTER TABLE "History" ADD COLUMN     "type" "Type" NOT NULL DEFAULT 'CREATED';
