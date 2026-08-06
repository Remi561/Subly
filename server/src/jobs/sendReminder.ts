import { prisma } from "../libs/prisma.js";
import { sendReminderEmail } from "../services/email.service.js";

export async function sendReminder() {
  const users = await prisma.user.findMany({
    where: {
      emailNofiticationEnabled: true,
    },
    include: {
      subscriptionRecords: {
        where: {
          status: "ACTIVE",
        },
      },
    },
  });

  for (const user of users) {
    const reminderDate = new Date();

    reminderDate.setDate(reminderDate.getDate() + user.reminderDaysBefore);

    const dueSubscription = user.subscriptionRecords.filter(
      (sub) => !sub.reminderSent && sub.nextBillingDate <= reminderDate,
    );

    if (!dueSubscription.length) continue;

    await sendReminderEmail(user, dueSubscription);

    const dueSubscriptionIds = dueSubscription.map(sub => sub.id)




    //creating notification

    await prisma.subscription.updateMany({
      where: {
        id: {
          in: dueSubscriptionIds
        },
      
      },
      data: {
        reminderSent: true
      }
    })

    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "Subscriptions about to be renewed",
        message: `${dueSubscription.length} of your ${dueSubscription.length > 1 ? "subscriptions": "subscription"} is about to expire`,
      },
    });
  }
}

