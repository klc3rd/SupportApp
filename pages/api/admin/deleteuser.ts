import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import User from "../../../lib/db/schemas/Users";
import Tickets from "../../../lib/db/schemas/Ticket";
import Err from "../../../lib/Err";
import { authOptions } from "../auth/[...nextauth]";

const DeleteUser = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "DELETE") {
    try {
      const session = await unstable_getServerSession(req, res, authOptions);

      if (!session || session.user.role !== "admin") {
        throw new Err(422, "You must be logged in with an admin account");
      }

      const userid = req.body.userid;

      if (!userid) {
        throw new Err(422, "You must specify a user");
      }

      await Tickets.deleteMany({ poster_id: userid });
      await User.deleteOne({ _id: userid });

      res.status(200).json({ message: "User deleted" });
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

export default DeleteUser;
