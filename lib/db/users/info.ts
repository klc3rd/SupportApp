/**
 * This provides a function to retrieve a users role
 * and username
 */
import { connectToDB } from "../db";
import User from "../schemas/Users";

export const getInfoByEmail = async (email: string) => {
  // connect to DB
  await connectToDB();

  const foundUser = await User.findOne({ email: email });

  return foundUser;
};
