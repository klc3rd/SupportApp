import { NextApiRequest, NextApiResponse } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import Ticket from "../../../lib/db/schemas/Ticket";
import Status from "../../../lib/enums/ticket-status";

import Err from "../../../lib/Err";

const ReopenTicket = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const session: Session | null = await unstable_getServerSession(
        req,
        res,
        authOptions
      );

      const userid = session?.user.id;
      const userRole = session?.user.role;
      const ticketid = req.body.ticketid;
      const ticket = await Ticket.findOne({ _id: ticketid });

      if (
        ticket?.poster_id !== userid &&
        userRole !== "admin" &&
        userRole !== "tech"
      ) {
        throw new Err(422, "You do not have permission to modify this ticket");
      }

      let newStatus: Status;

      if (ticket?.poster_id !== userid) {
        newStatus = Status.AwaitingUserResponse;
      } else {
        newStatus = Status.AwaitingTechniciansResponse;
      }

      // If the ticket is unassigned, it will be unassigned when reopened
      if (ticket?.assigned_id === "") {
        newStatus = Status.Unassigned;
      }

      await Ticket.updateOne({ _id: ticketid }, { status: newStatus });

      res.status(200).json({ message: "Ticket reopened" });
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

export default ReopenTicket;
