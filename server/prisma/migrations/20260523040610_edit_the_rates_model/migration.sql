/*
  Warnings:

  - A unique constraint covering the columns `[baseCurrency]` on the table `Rates` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `rates` on the `Rates` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Rates" DROP COLUMN "rates",
ADD COLUMN     "rates" JSONB NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Rates_baseCurrency_key" ON "Rates"("baseCurrency");
