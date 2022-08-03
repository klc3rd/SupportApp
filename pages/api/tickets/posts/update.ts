import { NextApiRequest, NextApiResponse } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import Post from "../../../../lib/db/schemas/Post";

import Err from "../../../../lib/Err";

const UpdatePost = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const session: Session | null = await unstable_getServerSession(
        req,
        res,
        authOptions
      );

      const userid = session?.user.id;
      const post_id = req.body.post_id;
      const message = req.body.message;

      const post = await Post.findOne({ _id: post_id });
      const poster_id = post?.poster_id;

      // Check if the current user is the poster
      if (userid !== poster_id) {
        throw new Err(422, "You do not have permission to edit this post");
      }

      // Update post
      const response = await Post.updateOne(
        { _id: post_id },
        { message: message }
      );

      res.status(200).json({ message: "Post updated" });
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

export default UpdatePost;
