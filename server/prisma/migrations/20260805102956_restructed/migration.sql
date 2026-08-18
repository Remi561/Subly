/*
  Warnings:

  - You are about to drop the column `subscriptionId` on the `History` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionLogoUrl` on the `History` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `userId` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_subscriptionId_fkey";

-- DropIndex
DROP INDEX "History_subscriptionId_idx";

-- AlterTable
ALTER TABLE "History" DROP COLUMN "subscriptionId",
DROP COLUMN "subscriptionLogoUrl",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "logoUrl",
ADD COLUMN     "linkToSite" TEXT;

-- CreateIndex
CREATE INDEX "History_userId_idx" ON "History"("userId");

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
