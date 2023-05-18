import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { AddCartType } from "@/app/product/[id]/AddCart";
import { PrismaClient } from "@prisma/client";
import { prisma } from "@/util/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

const calculateTotalOrder = (items: AddCartType[]) => {
  const totalPrice = items.reduce((acc, item) => {
    return acc + item.unit_amount! * item.quantity!;
  }, 0);
  return totalPrice;
};
type data = {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  id?: string | null | undefined;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userSession = await getServerSession(req, res, authOptions);
  //   console.log(userSession);
  if (!userSession?.user) {
    res.status(403).json({ message: "Not logged In" });
    return;
  }
  const { items, payment_intent_id } = req.body;

  const orderData = {
    user: { connect: { id: userSession?.user?.id } },
    amount: calculateTotalOrder(items),
    currency: "usd",
    status: "pending",
    paymentIntentID: payment_intent_id,
    products: {
      create: items.map((item: any) => ({
        name: item.name,
        description: item.description,
        unit_amount: parseFloat(item.unit_amount),
        image: item.image,
        quantity: item.quantity,
      })),
    },
  };
  if (payment_intent_id) {
    const current_intent = await stripe.paymentIntents.retrieve(
      payment_intent_id
    );
    if (current_intent) {
      const updated_intent = await stripe.paymentIntents.update(
        payment_intent_id,
        {
          amount: calculateTotalOrder(items),
        }
      );
      const existingOrder = await prisma.order.findFirst({
        where: {
          paymentIntentID: updated_intent.id,
        },
        include: {
          products: true,
        },
      });
      if (!existingOrder) {
        res.status(400).json({ message: "Invalid payment intent" });
      }

      const updated_order = await prisma.order.update({
        where: {
          id: existingOrder?.id,
        },
        data: {
          amount: calculateTotalOrder(items),
          products: {
            deleteMany: {},
            create: items.map((item: any) => ({
              name: item.name,
              description: item.description,
              unit_amount: parseFloat(item.unit_amount),
              image: item.image,
              quantity: item.quantity,
            })),
          },
        },
      });
      res.status(200).json({ paymentIntent: updated_intent });
      return;
    }
  } else {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateTotalOrder(items),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });
    orderData.paymentIntentID = paymentIntent.id;
    const newOrder = await prisma.order.create({
      data: orderData,
    });
    res.status(200).json({ paymentIntent });
    return;
  }
}
