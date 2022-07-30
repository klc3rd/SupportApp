import { NextApiRequest, NextApiResponse } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { ISecuredUser } from "user-types";
import User from "../../../lib/db/schemas/Users";
import Err from "../../../lib/Err";

const GetUser = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const session: Session | null = await unstable_getServerSession(
        req,
        res,
        authOptions
      );

      if (!session) {
        throw new Err(422, "You are not logged in");
      }

      const userid = req.query.uid;
      const user: ISecuredUser | null = await User.findOne({
        _id: userid,
      });

      res.status(200).send(user);
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

export default GetUser;
