import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";
import { prisma } from "@/util/prisma";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  events: {
    createUser: async ({ user }) => {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: "2022-11-15",
      });
      if (user.email && user.name) {
        const costumer = await stripe.customers.create({
          email: user.email || undefined,
          name: user.name || undefined,
        });
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            stripeCustomerId: costumer.id,
          },
        });
      }
    },
  },
  callbacks: {
    async session({ user, token, session }) {
      session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      };
      return session;
    },
  },
};

export default NextAuth(authOptions);
