import { NextApiRequest, NextApiResponse } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import Ticket from "../../../../lib/db/schemas/Ticket";
import Status from "../../../../lib/enums/ticket-status";
import Post from "../../../../lib/db/schemas/Post";

import Err from "../../../../lib/Err";

const Posts = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const session: Session | null = await unstable_getServerSession(
        req,
        res,
        authOptions
      );

      // Stores if this is a user or a tech posting
      let postingStatus = Status.AwaitingTechniciansResponse;

      const userid = session?.user.id;
      const poster_id = req.body.poster_id;
      const ticket_poster = req.body.ticket_poster;
      const ticket_id = req.body.ticket_id;
      const assigned_id = req.body.assigned_id;
      const date = new Date();
      const message = req.body.message;

      // Check if the current user is the assigned tech
      // const ticket = await Ticket.findOne({ _id: ticket_id });
      const isTech = userid === assigned_id;

      // If user is not the poster, or assigned tech, throw error
      if (userid == ticket_poster) {
        postingStatus = Status.AwaitingTechniciansResponse;
      } else if (isTech && userid !== ticket_poster) {
        postingStatus = Status.AwaitingUserResponse;
      } else {
        throw new Err(422, "You do not have permission to post to this ticket");
      }

      const newPost = new Post({
        ticket_id: ticket_id,
        poster_id: poster_id,
        date: date,
        message: message,
      });

      // Update ticket status
      await Ticket.updateOne({ _id: ticket_id }, { status: postingStatus });

      const response = await newPost.save();

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

export default Posts;
