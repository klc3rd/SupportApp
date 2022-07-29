import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import Err from "../../../lib/Err";
import { getUsers } from "../../../lib/db/users/info";
import { ISecuredUser } from "user-types";

const Profilehandler = async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * Get currently logged in user's info, the reason for this rather than using
   * just the session is to refresh after changing info
   */
  if (req.method === "GET") {
    try {
      // Check if the user is logged in
      const session = await unstable_getServerSession(req, res, authOptions);

      if (!session || session.user.role !== "admin") {
        throw new Err(422, "You must be logged in with an admin account");
      }

      const foundUser: ISecuredUser[] | null = await getUsers();

      res.status(200).send(foundUser);
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

export default Profilehandler;
