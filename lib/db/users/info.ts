/**
 * This file contains functions for getting Users
 * through various methods
 */

import { connectToDB } from "../db";
import User, { iUser } from "../schemas/Users";

export const getUserByEmail = async (email: string) => {
  // connect to DB
  await connectToDB();

  const foundUser: iUser | null = await User.findOne({ email: email });

  return foundUser;
};
