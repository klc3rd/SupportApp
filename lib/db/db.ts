import mongoose from "mongoose";

export const connectToDB = async () => {
  await mongoose.connect(process.env.DB_CONNECTION as string);
};
