import { NextApiRequest, NextApiResponse } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import Ticket from "../../../../lib/db/schemas/Ticket";
import User from "../../../../lib/db/schemas/Users";
import Post from "../../../../lib/db/schemas/Post";
import { IPost } from "ticket-types";
import { ISecuredUser } from "user-types";

import Err from "../../../../lib/Err";

const GetPosts = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const session: Session | null = await unstable_getServerSession(
        req,
        res,
        authOptions
      );

      const userid = session?.user.id;
      const userRole = session?.user.role;
      const ticketid = req.query.ticketid;

      const ticket = await Ticket.findOne({ _id: ticketid });

      if (
        ticket?.poster_id !== userid &&
        userRole !== "admin" &&
        userRole !== "tech"
      ) {
        throw new Err(422, "You do not have permission to view this page");
      }

      // Retrieve posts
      const posts: IPost[] | null = await Post.find({ ticket_id: ticketid });

      res.status(200).json(posts);
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

export default GetPosts;
