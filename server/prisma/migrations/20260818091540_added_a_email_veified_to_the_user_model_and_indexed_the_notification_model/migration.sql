/*
  Warnings:

  - The `emailVerified` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EmailVerified" AS ENUM ('VERIFIED', 'UNVERIFIED');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified",
ADD COLUMN     "emailVerified" "EmailVerified" NOT NULL DEFAULT 'VERIFIED';

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");
