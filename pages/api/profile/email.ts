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

const EditEmail = async (req: NextApiRequest, res: NextApiResponse) => {
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

      let submittedEmail = req.body.email;

      const foundUser: IUser | null = await getUserByID(session.user.id);

      if (!submittedEmail) {
        submittedEmail = foundUser!.email;
      }

      const response = await Users.updateOne(
        { _id: foundUser!.id },
        { email: submittedEmail }
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

export default EditEmail;
