/**
 * This page processes login requests using next-auth
 */
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "../../../lib/db/db";

import {
  getUserByUsername,
  getSecureByEmail,
} from "../../../lib/db/users/info";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  callbacks: {
    async session({ session }) {
      if (session.user?.email) {
        const foundUser = await getSecureByEmail(session.user.email);
        if (foundUser) {
          session.user = foundUser;
        }
      }
      return session;
    },
  },
  providers: [],
};

export default NextAuth({
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      credentials: {
        username: {
          label: "username",
          type: "text",
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      async authorize(credentials) {
        // Connect to db
        await connectToDB();

        // Find user based on username
        const foundUser = await getUserByUsername(credentials!.username);

        if (!foundUser) {
          return null;
        }

        // Check that the password is correct
        if (!bcrypt.compareSync(credentials!.password, foundUser.password)) {
          return null;
        }

        return foundUser;
      },
    }),
  ],
});
