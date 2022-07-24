import mongoose from "mongoose";
import { IUser } from "user-types";

const UserSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
});

const UserModel: mongoose.Model<IUser> =
  mongoose.models?.Users || mongoose.model<IUser>("Users", UserSchema);
export default UserModel;
