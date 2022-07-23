/**
 * This page processes login requests using next-auth
 */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "../../../lib/db/db";
import Users, { iUser } from "../../../lib/db/schemas/Users";
import bcrypt from "bcryptjs";

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
        const foundUser: iUser | null = await Users.findOne({
          username: credentials!.username,
        });

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
