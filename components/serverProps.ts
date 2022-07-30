import { Session, unstable_getServerSession } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../pages/api/auth/[...nextauth]";

/**
 * Serverside code for standard logged in pages
 */
export const serverProps = async (context: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const session: Session | null = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  // Get currently logged in user's role if
  // unsuccessful, forward to login page
  if (session) {
    return {
      props: {
        userid: session.user.id,
        username: session.user.username,
        userRole: session.user.role,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};

/**
 * Serverside code for the admin pages
 */
export const adminProps = async (context: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const session: Session | null = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  // Get currently logged in user's role and email
  // if unsuccessful, forward to login page
  if (session?.user.role === "admin") {
    return {
      props: {
        username: session.user.username,
        userRole: session.user.role,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};
