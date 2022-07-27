/**
 * This API route is for creating a new support ticket
 */
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import ShortUniqueId from "short-unique-id";
import { authOptions } from "../auth/[...nextauth]";

import Err from "../../../lib/Err";
import Ticket from "../../../lib/db/schemas/Ticket";

/**
 * API Route for creating a new ticket request
 */
const newTicket = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    // Get user session
    const session = await unstable_getServerSession(req, res, authOptions);

    // Return unauthorized error if there is no session
    if (!session) {
      res.status(401).json({ message: "User not authorized" });
      return;
    }

    try {
      // Create a ticket number
      const uid_alpha = new ShortUniqueId({
        dictionary: "alpha_lower",
        length: 5,
      });
      const uid_num = new ShortUniqueId({ dictionary: "number", length: 6 });
      const ticketNumber = uid_alpha() + "-" + uid_num();

      const device = req.body.device;
      const summary = req.body.summary;
      const issue = req.body.issue;
      const replicationSteps = req.body.replicationSteps;

      /**
       * Check that appropriate values are not blank
       */
      if (device === "") {
        throw new Err(422, "Must specify a device");
      }

      if (summary === "") {
        throw new Err(422, "Must include a summary");
      }

      if (issue === "") {
        throw new Err(422, "Must include an issue");
      }

      // Make date string
      const date = new Date();

      // Create the ticket object
      const newTicket = new Ticket({
        poster_id: session.user.id,
        assigned_id: "",
        date: date,
        number: ticketNumber,
        device: device,
        summary: summary,
        issue: issue,
        steps: replicationSteps,
      });

      const response = await newTicket.save();

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

export default newTicket;
