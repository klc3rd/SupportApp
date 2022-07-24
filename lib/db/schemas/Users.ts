import mongoose from "mongoose";

export interface iUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  role: string;
}

const UserSchema = new mongoose.Schema<iUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
});

const UserModel: mongoose.Model<iUser> =
  mongoose.models?.Users || mongoose.model<iUser>("Users", UserSchema);
export default UserModel;
