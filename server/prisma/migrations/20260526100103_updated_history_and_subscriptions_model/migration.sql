-- AlterTable
ALTER TABLE "History" ADD COLUMN     "category" "Category" NOT NULL DEFAULT 'OTHER';

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "expiredEmailSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "expiredEmailSentAt" TIMESTAMP(3),
ADD COLUMN     "reminderDaysBefore" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "reminderEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "reminderSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reminderSentAt" TIMESTAMP(3);
