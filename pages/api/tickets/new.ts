import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import ShortUniqueId from "short-unique-id";
import { authOptions } from "../auth/[...nextauth]";

/**
 * API Route for creating a new ticket request
 */
const newTicket = async (req: NextApiRequest, res: NextApiResponse) => {
  // Get user session
  const session = await unstable_getServerSession(req, res, authOptions);

  // Return unauthorized error if there is no session
  if (!session) {
    res.status(401).json({ message: "User not authorized" });
    return;
  }

  // Create a ticket number
  const uid_alpha = new ShortUniqueId({ dictionary: "alpha_lower", length: 5 });
  const uid_num = new ShortUniqueId({ dictionary: "number", length: 6 });
  const ticketNumber = uid_alpha() + "-" + uid_num();

  const device = req.body.device;
  const summary = req.body.summary;
  const issue = req.body.issue;
  const replicationSteps = req.body.replicationSteps;

  res.status(200).json({ ticket: ticketNumber });
};

export default newTicket;
