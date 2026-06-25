/*
  Warnings:

  - You are about to drop the column `reminderDaysBefore` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `reminderEnabled` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `reminderSentAt` on the `Subscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "reminderDaysBefore",
DROP COLUMN "reminderEnabled",
DROP COLUMN "reminderSentAt";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailNofiticationEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "reminderDaysBefore" INTEGER NOT NULL DEFAULT 3;

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
