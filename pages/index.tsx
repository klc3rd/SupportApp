/******************************
 * This is the main page of the app, this is only accessible
 * if logged in, otherwise forwards you to the login page
 *******************************/

import { getSession, signOut } from "next-auth/react";
import { Session } from "next-auth";
import type { NextApiRequest } from "next";
import TransitionContainer from "../components/motion/transition-container";
import { getUserByEmail } from "../lib/db/users/info";

// Get page elements
import MainContainer from "../components/main-container";

interface iIndexPage {
  userRole: string;
  userEmail: string;
}

const IndexPage: React.FC<iIndexPage> = (props) => {
  const role = props.userRole;

  return (
    <TransitionContainer>
      <MainContainer role={role}>
        <h1>Test home page!</h1>
        <h2>You are a {role}</h2>
        <button
          onClick={() => {
            signOut();
          }}
        >
          Sign Out
        </button>
      </MainContainer>
    </TransitionContainer>
  );
};

/**
 * Serverside code
 */
export const getServerSideProps = async (context: { req: NextApiRequest }) => {
  const session: Session | null = await getSession({ req: context.req });

  // Get currently logged in user's role and email
  // if unsuccessful, forward to login page
  if (session && session.user?.email) {
    const user = await getUserByEmail(session.user.email);
    return {
      props: {
        userRole: user?.role,
        userEmail: user?.email,
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

IndexPage.displayName = "IndexPage";
export default IndexPage;
