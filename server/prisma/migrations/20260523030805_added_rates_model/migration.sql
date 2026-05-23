-- CreateTable
CREATE TABLE "Rates" (
    "id" TEXT NOT NULL,
    "baseCurrency" TEXT NOT NULL,
    "rates" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rates_pkey" PRIMARY KEY ("id")
);
