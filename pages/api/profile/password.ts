/**
 * This page updates the user email
 */
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { IUser } from "user-types";
import Users from "../../../lib/db/schemas/Users";
import Err from "../../../lib/Err";
import { getUserByID } from "../../../lib/db/users/info";
import bcrypt from "bcryptjs";

const EditPassword = async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * Get currently logged in user's info, the reason for this rather than using
   * just the session is to refresh after changing info
   */
  if (req.method === "POST") {
    try {
      // Check if the user is logged in
      const session = await unstable_getServerSession(req, res, authOptions);

      if (!session) {
        throw new Err(422, "You are not logged in");
      }

      const oldPassword = req.body.oldPassword;
      const newPassword = req.body.newPassword;

      const foundUser: IUser | null = await getUserByID(session.user.id);

      // Check that the old password matches
      if (!bcrypt.compareSync(oldPassword, foundUser!.password)) {
        throw new Err(422, "The old password does not match");
      }

      // Check that the new password is over 8 characters and less than 255
      if (newPassword.length < 8 || newPassword.length >= 255) {
        throw new Err(422, "Password must be at least 8 characters");
      }

      // Hash password
      const passwordHash = bcrypt.hashSync(newPassword, 10);

      const response = await Users.updateOne(
        { _id: foundUser!.id },
        { password: passwordHash }
      );

      res.status(200).send(response);
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

export default EditPassword;
