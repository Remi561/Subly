import { Resend } from "resend";
import { env } from "../config/env.js";
const resend = new Resend(env.RESEND_API_KEY)

export async function sendReminderEmail(user, subscriptions) {
    const items = subscriptions.map(sub => `<li>${sub.name} - ${sub.nextBillingDate}</li>`).join('')

    await resend.emails.send({
      from: "Subly <onboarding@resend.dev>",
      to: user.email,
      subject: `${subscriptions.length} Subscription is about to expire in ${user.reminderDaysBefore}`,
      html: `
          <h2>Hello ${user.username}</h2>
    
          <p>
            The following subscriptions are renewing soon:
          </p>
    
          <ul>
            ${items}
          </ul>
    
          <p>
            Open Subly to manage your subscriptions.
          </p>
        `,
    });

}

export async function sendExpired(user, subscriptions) {
    const items = subscriptions.map(sub => `<li>${sub.name} - ${sub.nextBillingDate}</li>`).join('')

    await resend.emails.send({
      from: "Subly <onboarding@resend.dev>",
      to: user.email,
      subject: `Your subscription just expired`,
      html: `
          <h2>Hello ${user.username}</h2>
    
          <p>
            The following subscriptions just expired:
          </p>
    
          <ul>
            ${items}
          </ul>
    
          <p>
            Open Subly to manage your subscriptions.
          </p>
        `,
    });

}