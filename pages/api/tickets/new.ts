import { NextApiRequest, NextApiResponse } from "next";
import ShortUniqueId from "short-unique-id";

const newTicket = (req: NextApiRequest, res: NextApiResponse) => {
  // Don't forget this is how you create a short ID with the "short-unique-id" package
  const uid_alpha = new ShortUniqueId({ dictionary: "alpha_lower", length: 5 });
  const uid_num = new ShortUniqueId({ dictionary: "number", length: 6 });
  const ticketNumber = uid_alpha() + "-" + uid_num();
  res.status(200).json({ ticket: ticketNumber });
};

export default newTicket;
