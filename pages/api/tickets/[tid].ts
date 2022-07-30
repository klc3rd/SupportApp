import { NextApiRequest, NextApiResponse } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import Ticket from "../../../lib/db/schemas/Ticket";
import Err from "../../../lib/Err";

const GetTicket = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const session: Session | null = await unstable_getServerSession(
        req,
        res,
        authOptions
      );

      const role = session?.user.role;
      const userid = session?.user.id;
      const ticketid = req.query.tid;

      // Retrieve ticket
      const ticket = await Ticket.findOne({ _id: ticketid });

      // Check if user has permission to see this ticket
      if (ticket!.poster_id !== userid && role !== "admin" && role !== "tech") {
        throw new Err(422, "You do not have permission to see this ticket");
      }

      res.status(200).send(ticket);
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

export default GetTicket;
