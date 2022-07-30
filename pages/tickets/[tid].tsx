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
import Button from "../../components/ui/button";

interface ITicketPage {
  userid: string;
  username: string;
  userRole: string;
}

interface ITicketData {
  user: ISecuredUser;
  ticket: ITicket;
}

const TicketPage: React.FC<ITicketPage> = (props) => {
  const { userid, username, userRole } = props;
  const [error, setError] = useState<string | null>(null);
  const [ticketData, setTicketData] = useState<ITicketData | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [assignableStatus, setAssignableStatus] = useState<string | null>(null);

  // Get ticket id from URL Param
  const router = useRouter();
  const ticket_id = router.query.tid;

  /**
   *  Retrieve ticket
   */
  useEffect(() => {
    /**
     * Get info for ticket
     */
    const getPostData = () => {
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
    };

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
    getPostData();
  }, [status, ticketData, ticket_id]);

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
                <Button icon="add">Assign as Tech</Button>
              </div>
            )}
            {assignableStatus == "assigned" && (
              <div className="ticket-grid-btnfield">
                <Button icon="minus">Unassign</Button>
              </div>
            )}
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
