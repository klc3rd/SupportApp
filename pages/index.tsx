/******************************
 * This is the main page of the app, this is only accessible
 * if logged in, otherwise forwards you to the login page
 *******************************/

import { getSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Session, unstable_getServerSession } from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next";
import AddRequest from "../components/addrequest";
import { authOptions } from "./api/auth/[...nextauth]";

// Get page elements
import MainContainer from "../components/main-container";

interface iIndexPage {
  userRole: string;
  userEmail: string;
}

const IndexPage: React.FC<iIndexPage> = (props) => {
  const role = props.userRole;

  // If true, addRequest shows an overlay and modal for adding a request
  const [addRequest, setAddRequest] = useState<boolean>(false);

  // submitRequestHandler and closeAddRequest open and close the
  // new request modal and overlay
  const submitRequestHandler = () => {
    setAddRequest(true);
  };
  const closeAddRequest = () => {
    setAddRequest(false);
  };

  /**
   * Return main page
   */

  return (
    <MainContainer submitRequestHandler={submitRequestHandler} role={role}>
      <>
        {addRequest && <AddRequest closeHandler={closeAddRequest} />}
        <h1>Test home page!</h1>
        <h2>You are a {role}</h2>
        <button
          onClick={() => {
            signOut();
          }}
        >
          Sign Out
        </button>
      </>
    </MainContainer>
  );
};

/**
 * Serverside code
 */
export const getServerSideProps = async (context: {
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
  if (session && session.user!.email) {
    return {
      props: {
        userRole: session.user.role,
        userEmail: session.user.email,
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
