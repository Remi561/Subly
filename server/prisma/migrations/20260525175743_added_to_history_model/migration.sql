/*
  Warnings:

  - Added the required column `subscriptionLogoUrl` to the `History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscriptionName` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "History" ADD COLUMN     "subscriptionLogoUrl" TEXT NOT NULL,
ADD COLUMN     "subscriptionName" TEXT NOT NULL;
