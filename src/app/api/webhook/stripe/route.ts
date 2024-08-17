import { stripe } from "@/app/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";
import prisma from "@/app/lib/db";

async function getPlanNameFromProductId(productId: string): Promise<string> {
  try {
    const product = await stripe.products.retrieve(productId);
    return product.name || "Unknown";
  } catch (error) {
    console.error("Error retrieving product:", error);
    return "Unknown";
  }
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: unknown) {
    console.log("error", error);
    return new Response("webhook error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    const customerId = String(session.customer);
    const product = subscription?.items?.data[0]?.plan?.product;
    const planName = typeof product === 'string' ? await getPlanNameFromProductId(product) : 'Unknown';
      console.log(planName , "Plan one ")
      const user = await prisma.user.findUnique({
      where: {
        stripeCustomerId: customerId,
      },
    });

    if (!user) throw new Error("User not found...");

    await prisma.subscription.create({
      data: {
        stripeSubscriptionId: subscription.id,
        userId: user.id,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        status: subscription.status,
        planId: subscription.items.data[0].plan.id,
        interval: String(subscription.items.data[0].plan.interval),
        planName: planName
      },
    });
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const updateRecord = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: subscription.id },
    });
    const product = subscription?.items?.data[0]?.plan?.product;
    const planName =   typeof product === 'string' ? await getPlanNameFromProductId(product) : 'Unknown';
    console.log(planName , "Plane Two")
    if (updateRecord) {
      await prisma.subscription.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          planId: subscription.items.data[0].price.id,
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end,
          status: subscription.status,
          interval: String(subscription.items.data[0].plan.interval),
          planName: planName
        },
      });
    }
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    const product = subscription?.items?.data[0]?.plan?.product;
    const planName = typeof product === 'string' ? await getPlanNameFromProductId(product) : 'Unknown';
    console.log("I am update", planName);
    const updateRecord = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: subscription?.id }
    });

    if (updateRecord) {
      await prisma.subscription.update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          planId: subscription.items.data[0].price.id,
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end,
          status: subscription.status,
          planName: planName
        },
      });
    }
  }

  return new Response(null, { status: 200 });
}
