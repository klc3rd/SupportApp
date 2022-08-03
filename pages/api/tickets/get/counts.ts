/**
 * Returns counts of tickets based on their status
 */
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import Status from "../../../../lib/enums/ticket-status";
import Err from "../../../../lib/Err";
import Ticket from "../../../../lib/db/schemas/Ticket";

import { ITicket } from "ticket-types";

const GetTickets = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const session = await unstable_getServerSession(req, res, authOptions);

      if (!session) {
        throw new Err(422, "You must be signed in");
      }

      const userRole = session.user.role;
      const userid = session.user.id;

      let totalTickets;
      let closedTickets;
      let awaitingTechniciansResponse;
      let awaitingUsersResponse;

      /**
       * if the user is not a tech or admin, only return numbers for
       * their own tickets. Otherwise return numbers for all tickets
       */
      if (userRole !== "admin" && userRole !== "tech") {
        totalTickets = await Ticket.countDocuments({ poster_id: userid });
        closedTickets = await Ticket.countDocuments({
          poster_id: userid,
          status: Status.Closed,
        });
        awaitingTechniciansResponse = await Ticket.countDocuments({
          poster_id: userid,
          status: Status.AwaitingTechniciansResponse,
        });
        awaitingUsersResponse = await Ticket.countDocuments({
          poster_id: userid,
          status: Status.AwaitingUserResponse,
        });
      } else {
        totalTickets = await Ticket.countDocuments();
        closedTickets = await Ticket.countDocuments({
          status: Status.Closed,
        });
        awaitingTechniciansResponse = await Ticket.countDocuments({
          status: Status.AwaitingTechniciansResponse,
        });
        awaitingUsersResponse = await Ticket.countDocuments({
          status: Status.AwaitingUserResponse,
        });
      }

      let openTickets = totalTickets - closedTickets;

      const counts = {
        totalTickets,
        closedTickets,
        awaitingUsersResponse,
        awaitingTechniciansResponse,
        openTickets,
      };

      res.status(200).json(counts);
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
