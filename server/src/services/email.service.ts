
import { Resend } from "resend";
import { env } from "../config/env.js";
import { SubscriptionCreateInput } from "../generated/prisma/models.js";
import { User } from "../generated/prisma/client.js";
const resend = new Resend(env.RESEND_API_KEY)

export async function sendReminderEmail(user: any, subscriptions:any[]): Promise<void> {
    const items = subscriptions.map(sub => `<li>${sub.name} on ${sub.nextBillingDate}</li>`).join('')

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
    
          <button>
            Open Subly to manage your subscriptions.
          </button>

          
        `,
    });

}

export async function sendExpired(user: Record<string, string>, subscriptions: SubscriptionCreateInput[]): Promise<void> {
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