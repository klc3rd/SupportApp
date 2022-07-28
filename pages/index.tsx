/******************************
 * This is the main page of the app, this is only accessible
 * if logged in, otherwise forwards you to the login page
 *******************************/

import { useState, useEffect } from "react";
import { Session, unstable_getServerSession } from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next";
import AddRequest from "../components/addrequest";
import { authOptions } from "./api/auth/[...nextauth]";

import Status from "../lib/enums/ticket-status";
import { ITicket } from "ticket-types";

// Get page elements
import MainContainer from "../components/main-container";
import MainPanel from "../components/ticket-list/mainpanel";
import TicketList from "../components/ticket-list/list";

interface IIndexPage {
  userRole: string;
  userEmail: string;
}

const IndexPage: React.FC<IIndexPage> = (props) => {
  const role = props.userRole;
  const [filter, setFilter] = useState<number>(Status.All);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // This will be empty for now as a temporary stub
  const [tickets, setTickets] = useState<ITicket[]>([]);

  // If true, addRequest shows an overlay and modal for adding a request
  const [addRequest, setAddRequest] = useState<boolean>(false);

  /**
   * Get tickets and update state
   */
  useEffect(() => {
    fetch(`/api/tickets/get/${filter}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    }).then((response) => {
      response.json().then((data) => {
        setIsLoading(false);
        if (response.status !== 200) {
          setError(data.message);
          return;
        }

        setTickets(data);
      });
    });
  }, [filter, addRequest]);

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
    <MainContainer role={role}>
      <>
        {addRequest && <AddRequest closeHandler={closeAddRequest} />}
        <MainPanel submitRequestHandler={submitRequestHandler} tickets={[]} />
        <div className="main-status">
          {isLoading && `Loading...`}
          {!isLoading && tickets.length === 0 && `No tickets found`}
          {!isLoading && error && <span className="error">${error}</span>}
        </div>
        {tickets.length > 0 && <TicketList tickets={tickets} />}
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
