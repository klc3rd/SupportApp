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

const TicketPage: React.FC<ITicketPage> = (props) => {
  const { userid, username, userRole } = props;
  const [error, setError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<ITicket | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [postingUser, setPostingUser] = useState<ISecuredUser | null>(null);
  const [assignableStatus, setAssignableStatus] = useState<string | null>(null);

  // Get ticket id from URL Param
  const router = useRouter();
  const ticket_id = router.query.tid;

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

      setTicket(data);
    };

    getTicket();
  }, [status]);

  /**
   * Get info for ticket
   */
  useEffect(() => {
    const getPostingUser = async () => {
      if (ticket) {
        const response = await fetch(`/api/getuser/${ticket.poster_id}`);
        const data = await response.json();

        if (response.status !== 200) {
          setError(data.message);
          return;
        }

        setPostingUser(data);
      }
    };

    const assignableCheck = async () => {
      if (
        (userRole == "admin" || userRole == "tech") &&
        postingUser &&
        postingUser.username !== username
      ) {
        if (postingUser.assigned_id !== userid) {
          setAssignableStatus("assignable");
        } else {
          setAssignableStatus("assigned");
        }
      }
    };

    if (ticket) {
      // Format date
      setDate(new Date(ticket!.date).toLocaleString());

      // Set status
      switch (ticket.status) {
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

      getPostingUser();
      assignableCheck();
    }
  }, [ticket]);

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
              {postingUser?.username}
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
            <div className="ticket-grid-shortfield">{ticket?.number}</div>
            <div className="ticket-grid-header">Date</div>
            <div className="ticket-grid-shortfield">{date}</div>
            <div className="ticket-grid-header">Device</div>
            <div className="ticket-grid-shortfield">{ticket?.device}</div>
            <div className="ticket-grid-header">Summary</div>
            <div className="ticket-grid-field">{ticket?.summary}</div>
            <div className="ticket-grid-header">Status</div>
            <div className="ticket-grid-shortfield">{status}</div>
            <div className="ticket-grid-header">Issue</div>
            <div className="ticket-grid-field">{ticket?.issue}</div>
            {ticket?.steps && (
              <>
                <div className="ticket-grid-header">Steps</div>
                <div className="ticket-grid-field">{ticket?.steps}</div>
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
