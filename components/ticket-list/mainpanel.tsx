/**
 * This panel shows the stats on the main page with links to filters
 */
import { useState, useEffect, useRef } from "react";
import Button from "../ui/button";
import Status from "../../lib/enums/ticket-status";
import { ITicket } from "ticket-types";

interface IMainPanel {
  tickets: ITicket[];
  onFilterChange: (status: Status) => void;
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
  const { submitRequestHandler, onFilterChange } = props;
  const [counts, setCounts] = useState<ITicketCounts | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectRef = useRef<HTMLSelectElement | null>(null);

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

  const changeStatusMenu = () => {
    const statusVal = selectRef.current?.value;
    const newStatus: Status = parseInt(statusVal!);

    onFilterChange(newStatus);
  };

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
            <>
              <div className="main-panel-minibox">
                <select
                  className="main-panel-select"
                  name="status"
                  onChange={changeStatusMenu}
                  ref={selectRef}
                >
                  <option value={Status.All}>
                    Total Tickets - {counts?.totalTickets}
                  </option>
                  <option value={Status.Open}>
                    Open Tickets - {counts?.openTickets}
                  </option>
                  <option value={Status.AwaitingTechniciansResponse}>
                    Awaiting Technician Response -{" "}
                    {counts?.awaitingTechniciansResponse}
                  </option>
                  <option value={Status.AwaitingUserResponse}>
                    Awaiting User Response - {counts?.awaitingUsersResponse}
                  </option>
                  <option value={Status.Closed}>
                    Closed Tickets - {counts?.closedTickets}
                  </option>
                </select>
              </div>
              <div className="main-panel-box">
                <span
                  className="main-panel-link"
                  onClick={() => {
                    onFilterChange(Status.All);
                  }}
                >
                  Total - {counts?.totalTickets}
                </span>
                |
                <span
                  className="main-panel-link"
                  onClick={() => {
                    onFilterChange(Status.Open);
                  }}
                >
                  Open - {counts?.openTickets}
                </span>
                |
                <span
                  className="main-panel-link"
                  onClick={() => {
                    onFilterChange(Status.AwaitingUserResponse);
                  }}
                >
                  Awaiting User Response - {counts?.awaitingUsersResponse}
                </span>
                |
                <span
                  className="main-panel-link"
                  onClick={() => {
                    onFilterChange(Status.AwaitingTechniciansResponse);
                  }}
                >
                  Awaiting Technician Response -{" "}
                  {counts?.awaitingTechniciansResponse}
                </span>
                |
                <span
                  className="main-panel-link"
                  onClick={() => {
                    onFilterChange(Status.Closed);
                  }}
                >
                  Closed - {counts?.closedTickets}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MainPanel;
