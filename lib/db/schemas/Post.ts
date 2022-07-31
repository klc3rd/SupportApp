import { IPost } from "ticket-types";
import mongoose from "mongoose";

const PostSchema = new mongoose.Schema<IPost>({
  ticket_id: { type: String, required: true },
  poster_id: { type: String, required: true },
  date: { type: String, required: true },
  message: { type: String, required: true },
});

const PostModel: mongoose.Model<IPost> =
  mongoose.models?.Posts || mongoose.model<IPost>("Posts", PostSchema);
export default PostModel;
