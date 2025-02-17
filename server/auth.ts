import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/server";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/app/types/login-schema";
import { eq } from "drizzle-orm";
import { accounts, users } from "./schema";
import bcrypt from "bcrypt";
import Stripe from "stripe";
import { AdapterAccount } from "next-auth/adapters";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  events: {
    createUser: async ({ user }) => {
      const stripe = new Stripe(process.env.STRIPE_SECRET!, {
        apiVersion: "2025-01-27.acacia",
      });
      const customer = await stripe.customers.create({
        email: user.email!,
        name: user.name!,
      });
      await db
        .update(users)
        .set({ customerID: customer.id })
        .where(eq(users.id, user.id!));
    },
    signIn: async ({ user }) => {
      // Vytvoření nebo aktualizace záznamu v accounts při každém přihlášení
      if (user.email) {
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, user.email),
        });

        if (existingUser) {
          const existingAccount = await db.query.accounts.findFirst({
            where: eq(accounts.userId, existingUser.id),
          });

          if (!existingAccount) {
            await db.insert(accounts).values({
              userId: existingUser.id,
              type: "credentials" as AdapterAccount["type"],
              provider: "credentials",
              providerAccountId: existingUser.id,
              access_token: null,
              token_type: "Bearer",
              scope: "user",
              expires_at: Math.floor(Date.now() / 1000) + 86400, // 24 hodin
            });
          }
        }
      }
    },
  },
  callbacks: {
    async session({ session, token }) {
      if (session && token.sub) {
        session.user.id = token.sub;
      }
      if (session.user && token.role) {
        session.user.role = token.role as string;
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.image = token.image as string;

        // Kontrola a nastavení role
        const dbUser = await db.query.users.findFirst({
          where: eq(users.id, token.sub as string),
        });
        if (dbUser && dbUser.role) {
          session.user.role = dbUser.role;
        }
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, token.sub),
      });
      if (!existingUser) return token;
      const existingAccount = await db.query.accounts.findFirst({
        where: eq(accounts.userId, existingUser.id),
      });

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.twoFactorEnabled;
      token.image = existingUser.image;
      return token;
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Github({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      authorize: async (credentials) => {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await db.query.users.findFirst({
            where: eq(users.email, email),
          });
          if (!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) {
            // Ensure account record exists
            const existingAccount = await db.query.accounts.findFirst({
              where: eq(accounts.userId, user.id),
            });

            if (!existingAccount) {
              await db.insert(accounts).values({
                userId: user.id,
                type: "credentials" as AdapterAccount["type"],
                provider: "credentials",
                providerAccountId: user.id,
                access_token: null,
                token_type: "Bearer",
                scope: "user",
                expires_at: Math.floor(Date.now() / 1000) + 86400, // 24 hodin
              });
            }
            return user;
          }
        }
        return null;
      },
    }),
  ],
});
