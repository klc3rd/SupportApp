/**
 * Handles user registration on the server side
 */
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import fs from "fs";
import Err from "../../lib/Err";

// Import user model and connection function
import { connectToDB } from "../../lib/db/db";
import User from "../../lib/db/schemas/Users";

/**
 * Handle user creation
 * ------------
 * Received a JSON with
 * username, email, password, passwordConfirmation
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      await connectToDB();

      const { username, email, password, passwordConfirmation } = req.body;
      console.log(username, email, password, passwordConfirmation);

      // Check if username or email exists
      const usernameInUse = await User.findOne({ username: username });
      if (usernameInUse) {
        throw new Err(422, "Username in use");
      }

      const emailInUse = await User.findOne({ email: email });
      if (emailInUse) {
        throw new Err(422, "Email address is in use");
      }

      // Check if the password and password confirmation match
      if (password != passwordConfirmation) {
        throw new Err(422, "Password and password confirmation do not match");
      }

      // Check that password is >= 8 characters
      if (password.length < 8) {
        throw new Err(422, "Password must be at least 8 characters");
      }

      // encrypt password
      const passwordHash = bcrypt.hashSync(password, 10);

      /**
       * Check for .setup file, if it exists new users should be a "user" role,
       * if not, should be an admin role. After the first admin is made, the
       * file is created and following users are a "user" role
       */
      let role;

      if (fs.existsSync("./.setup")) {
        role = "user";
      } else {
        role = "admin";
        fs.writeFileSync("./.setup", "");
      }

      /**
       * Create user object
       */
      const newUser = new User({
        username: username,
        email: email,
        password: passwordHash,
        role: role,
      });

      const response = await newUser.save();

      res.status(200).json({ response });
    } catch (err) {
      /**
       * Determine type of error object before returning error
       */
      if (err instanceof Err) {
        res.status(err.status).json({ message: err.message });
      } else if (err instanceof Error) {
        res.status(500).json({ message: err.message });
      }
    }
  }
};

export default handler;
