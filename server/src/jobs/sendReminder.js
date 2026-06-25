import { prisma } from "../libs/prisma.js";
import { sendReminderEmail } from "../services/email.service.js";

async function sendReminder() {
  const users = await prisma.user.findMany({
    where: {
      emailNofiticationEnabled: true,
    },
    include: {
      subscriptions: {
        where: {
          status: "ACTIVE",
        },
      },
    },
  });

  for (const user of users) {
    const reminderDate = new Date();

    reminderDate.setDate(reminderDate.getDate() + user.reminderDaysBefore);

    const dueSubscription = user.subscriptions.filter(
      (sub) => !sub.reminderDaysBefore && sub.nextBillingDate <= reminderDate,
    );
      
      

    if (!dueSubscription.length) continue;

    await sendReminderEmail(user, dueSubscription);

    //creating notification

    await prisma.notification.create({
      data: {
            userId: user.id,
            title: "Subscriptions about to be renewed",
            message: `${dueSubscription.length} of your subscription is about to expire`,
      },
    });
  }
}

sendReminder()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect()
    })
