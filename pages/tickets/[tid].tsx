/******************************
 * This page displays the ticket itself as well as responses
 * this is also where you manage the ticket
 ******************************/

import { useEffect, useState } from "react";
import MainContainer from "../../components/main-container";
import { useRouter } from "next/router";
import Status from "../../lib/enums/ticket-status";
import { serverProps as getServerSideProps } from "../../components/serverProps";
import { ITicket } from "ticket-types";
import { ISecuredUser } from "user-types";
import Posts from "../../components/tickets/posts";
import Button from "../../components/ui/button";

interface ITicketPage {
  userid: string;
  username: string;
  userRole: string;
}

interface ITicketData {
  user: ISecuredUser;
  ticket: ITicket;
  assignedTech: ISecuredUser | null;
}

const TicketPage: React.FC<ITicketPage> = (props) => {
  const { userid, username, userRole } = props;
  const [error, setError] = useState<string | null>(null);
  const [ticketData, setTicketData] = useState<ITicketData | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [assignableStatus, setAssignableStatus] = useState<string | null>(null);

  // There are circular dependencies in the useEffects, this is to remove that
  // giving a way for them to refresh without causing issues
  const [ticketChangeCount, setTicketChangeCount] = useState<number>(0);

  // Get ticket id from URL Param
  const router = useRouter();
  const ticket_id = router.query.tid;

  const yourTicketStatus =
    !assignableStatus &&
    ticketData?.ticket.poster_id === userid &&
    userRole !== "user";

  /**
   *  Retrieve ticket
   */
  useEffect(() => {
    const getTicket = async () => {
      const response = await fetch(`/api/tickets/${ticket_id}`);
      const data = await response.json();

      if (response.status !== 200) {
        setError(data.message);
        return;
      }

      setTicketData(data);
    };

    getTicket();
    // getPostData();
  }, [status, ticket_id, userRole, userid, username, ticketChangeCount]);

  /**
   * Get post data
   */
  useEffect(() => {
    /**
     * Get info for ticket
     */
    const assignableCheck = async () => {
      if (
        (userRole == "admin" || userRole == "tech") &&
        ticketData &&
        ticketData.user.username !== username
      ) {
        if (ticketData.ticket.assigned_id !== userid) {
          setAssignableStatus("assignable");
        } else {
          setAssignableStatus("assigned");
        }
      }
    };

    if (ticketData?.ticket) {
      // Format date
      setDate(new Date(ticketData!.ticket!.date).toLocaleString());

      // Set status
      switch (ticketData!.ticket.status) {
        case Status.Closed:
          setStatus("Closed");
          break;
        case Status.Unassigned:
          setStatus("Unassigned");
          break;
        case Status.AwaitingTechniciansResponse:
          setStatus("Awaiting Technician Response");
          break;
        case Status.AwaitingUserResponse:
          setStatus("Awaiting User Response");
          break;
      }
    }

    assignableCheck();
  }, [ticketData, userRole, userid, username, ticketChangeCount]);

  // Assign ticket
  const assignTicketHandler = async () => {
    const response = await fetch("/api/tickets/assign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ticketid: ticketData!.ticket._id }),
    });

    const data = await response.json();

    if (response.status !== 200) {
      setError(data.message);
    }
    setTicketChangeCount((num) => num + 1);
  };

  const unassignTicketHandler = async () => {
    const response = await fetch("/api/tickets/unassign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ticketid: ticketData!.ticket._id }),
    });

    const data = await response.json();

    if (response.status !== 200) {
      setError(data.message);
    }

    setTicketChangeCount((num) => num + 1);
  };

  /**
   * Return main profile page
   */
  return (
    <MainContainer role={userRole}>
      <div className="ticket">
        <div className="error">{error && error}</div>
        {!error && (
          <div className="ticket-grid">
            <div className="ticket-grid-header">Posted By</div>
            <div className="ticket-grid-shortfield">
              {ticketData?.user.username}
            </div>
            {assignableStatus == "assignable" && (
              <div className="ticket-grid-btnfield">
                <Button onClick={assignTicketHandler} icon="add">
                  Assign as Tech
                </Button>
              </div>
            )}
            {assignableStatus == "assigned" && (
              <div className="ticket-grid-btnfield">
                <Button onClick={unassignTicketHandler} icon="minus">
                  Unassign
                </Button>
              </div>
            )}
            {!assignableStatus &&
              ticketData?.ticket.poster_id === userid &&
              userRole !== "user" && (
                <span className="ticket-yourticket">This is your ticket</span>
              )}
            <div className="ticket-grid-header">Assigned Tech</div>
            <div className="ticket-grid-shortfield">
              {ticketData?.assignedTech
                ? ticketData.assignedTech.username
                : "None"}
            </div>
            <div className="ticket-grid-header">Ticket Number</div>
            <div className="ticket-grid-shortfield">
              {ticketData?.ticket.number}
            </div>
            <div className="ticket-grid-header">Date</div>
            <div className="ticket-grid-shortfield">{date}</div>
            <div className="ticket-grid-header">Device</div>
            <div className="ticket-grid-shortfield">
              {ticketData?.ticket.device}
            </div>
            <div className="ticket-grid-header">Summary</div>
            <div className="ticket-grid-field">
              {ticketData?.ticket.summary}
            </div>
            <div className="ticket-grid-header">Status</div>
            <div className="ticket-grid-shortfield">{status}</div>
            <div className="ticket-grid-header">Issue</div>
            <div className="ticket-grid-field">{ticketData?.ticket.issue}</div>
            {ticketData?.ticket.steps && (
              <>
                <div className="ticket-grid-header">Steps</div>
                <div className="ticket-grid-field">
                  {ticketData?.ticket.steps}
                </div>
              </>
            )}
            {ticketData?.ticket && (
              <Posts
                userid={userid}
                username={username}
                userRole={userRole}
                ticket={ticketData.ticket}
              />
            )}
          </div>
        )}
      </div>
    </MainContainer>
  );
};

/**
 * Serverside code
 */
export { getServerSideProps };

TicketPage.displayName = "TicketPage";
export default TicketPage;
