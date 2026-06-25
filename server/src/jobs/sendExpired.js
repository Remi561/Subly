import { prisma } from "../libs/prisma.js";

export async function sendExpired() {
  const now = new Date();

  const result = await prisma.subscription.updateMany({
    where: {
      status: "ACTIVE",
      nextBillingDate: {
        lt: now,
      },
    },
    data: {
      status: "EXPIRED",
    },
  });
}

sendExpired().catch(console.error).finally(async () => {
    await prisma.$disconnect()
})