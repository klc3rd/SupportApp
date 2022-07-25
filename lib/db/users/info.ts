/**
 * This file contains functions for getting Users
 * through various methods
 */

import { connectToDB } from "../db";
import User from "../schemas/Users";
import { IUser, ISecuredUser } from "user-types";

export const getUserByEmail = async (email: string) => {
  // connect to DB
  await connectToDB();

  const foundUser: IUser | null = await User.findOne({ email: email });

  return foundUser;
};

export const getUserByUsername = async (username: string) => {
  // connect to DB
  await connectToDB();

  const foundUser: IUser | null = await User.findOne({ username: username });

  return foundUser;
};

// This is the same as getUserByUsername except that it does not return
// the password hash, this is meaant for use in the client
export const getSecureByEmail = async (email: string) => {
  // connect to DB
  await connectToDB();

  const foundUser: ISecuredUser | null = await User.findOne({ email: email });

  let returnUser: ISecuredUser | null = null;

  if (foundUser != null) {
    returnUser = {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      role: foundUser.role,
    };
  }

  return returnUser;
};
