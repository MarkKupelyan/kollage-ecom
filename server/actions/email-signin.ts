"use server";

import { LoginSchema } from "@/app/types/login-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";

const action = createSafeActionClient();
export const emailSignIn = action(
  LoginSchema,
  async ({ email, password, code }) => {
    //Fetch data and check is the user is in tha database
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser?.email !== email) {
      return { error: "Email not found" };
    }
    //if(!existingUser.emailVerified){

    // }

    console.log(email, password, code);
    return { success: email };
  }
);
