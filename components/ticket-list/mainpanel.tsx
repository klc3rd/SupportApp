/**
 * This panel shows the stats on the main page with links to filters
 */
import { useState, useEffect } from "react";
import Button from "../ui/button";
import { ITicket } from "ticket-types";

interface IMainPanel {
  tickets: ITicket[];
  submitRequestHandler: () => void;
}

interface ITicketCounts {
  totalTickets: number;
  closedTickets: number;
  awaitingUsersResponse: number;
  awaitingTechniciansResponse: number;
  openTickets: number;
}

const MainPanel: React.FC<IMainPanel> = (props) => {
  const { submitRequestHandler } = props;
  const [counts, setCounts] = useState<ITicketCounts | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCounts = async () => {
      const response = await fetch("/api/tickets/get/counts");
      const data = await response.json();

      if (response.status !== 200) {
        setError(data.message);
        return;
      }

      setCounts(data);
    };

    getCounts();
  }, []);

  return (
    <>
      <div className="main-panel">
        <div>
          <Button icon="add" onClick={submitRequestHandler}>
            Submit Request
          </Button>
        </div>
        <div className="main-panel-container">
          {error && <span className="error">{error}</span>}
          {!error && (
            <div>
              <span className="main-panel-link">
                Total - {counts?.totalTickets}
              </span>
              |
              <span className="main-panel-link">
                Open - {counts?.openTickets}
              </span>
              |
              <span className="main-panel-link">
                Awaiting User Response - {counts?.awaitingUsersResponse}
              </span>
              |
              <span className="main-panel-link">
                Awaiting Technician Response -
                {counts?.awaitingTechniciansResponse}
              </span>
              |
              <span className="main-panel-link">
                Closed -{counts?.closedTickets}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MainPanel;
