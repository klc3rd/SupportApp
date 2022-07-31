import { NextApiRequest, NextApiResponse } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import Ticket from "../../../lib/db/schemas/Ticket";
import Status from "../../../lib/enums/ticket-status";

import Err from "../../../lib/Err";

const UnassignTicket = async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * Unassign a ticket
   */
  if (req.method === "POST") {
    try {
      const session: Session | null = await unstable_getServerSession(
        req,
        res,
        authOptions
      );

      const role = session?.user.role;
      const ticketid = req.body.ticketid;

      if (!session || (role !== "admin" && role !== "tech")) {
        throw new Err(
          422,
          "You do not have permission to unassign this ticket"
        );
      }

      // Assign ticket to user
      await Ticket.updateOne({ _id: ticketid }, { assigned_id: "" });

      // Change ticket status
      await Ticket.updateOne({ _id: ticketid }, { status: Status.Unassigned });

      res.status(200).json({ message: "Ticket assigned successfully" });
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

export default UnassignTicket;
