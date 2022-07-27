/**
 * This returns an array of tickets, it also filters based on who's
 * logged in and the request tickets status
 */
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import Err from "../../../../lib/Err";
import Ticket from "../../../../lib/db/schemas/Ticket";
import Status from "../../../../lib/enums/ticket-status";

import { ITicket } from "ticket-types";

const GetTickets = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const session = await unstable_getServerSession(req, res, authOptions);

      if (!session) {
        throw new Err(422, "You must be signed in");
      }

      const role = session.user.role;
      const poster_id = session.user.id;
      const status = parseInt(req.query.status as string);

      let tickets: ITicket[] = [];

      // Get tickets from
      if (role === "admin" || role === "tech") {
        if (status == Status.All) {
          tickets = await Ticket.find();
        } else {
          tickets = await Ticket.find({ status: status });
        }
      } else {
        if (status == Status.All) {
          tickets = await Ticket.find({
            poster_id: poster_id,
          });
        } else {
          tickets = await Ticket.find({
            poster_id: poster_id,
            status: status,
          });
        }
      }

      // This is a placeholder response until it is fully implemented
      res.status(200).json(tickets);
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

export default GetTickets;
