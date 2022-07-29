import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import User from "../../../lib/db/schemas/Users";
import Err from "../../../lib/Err";
import { authOptions } from "../auth/[...nextauth]";

const ChangeRole = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const session = await unstable_getServerSession(req, res, authOptions);

      if (!session || session.user.role !== "admin") {
        throw new Err(422, "You must be logged in with an admin account");
      }

      const id = req.body.id;
      const role = req.body.role;

      const response = await User.updateOne({ _id: id }, { role: role });

      res.status(200).json(response);
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

export default ChangeRole;
