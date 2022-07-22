/**
 * Handles user registration on the server side
 */
import type { NextApiRequest, NextApiResponse } from "next";
import Err from "../../lib/Err";

type Data = {
  message: string;
};

const handler = (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method === "POST") {
    try {
      const { username, email, password, passwordConfirmation } = req.body;

      // Check if the password and password confirmation match
      if (password != passwordConfirmation) {
        throw new Err(422, "Password and password confirmation do not match");
      }

      res.status(200).json({ message: "Success!" });
    } catch (err) {
      if (err instanceof Err) {
        res.status(err.status).json({ message: err.message });
      }
    }
  }
};

export default handler;
