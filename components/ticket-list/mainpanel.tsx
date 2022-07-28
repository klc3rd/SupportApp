/**
 * This panel shows the stats on the main page with links to filters
 */
import Button from "../ui/button";
import { ITicket } from "ticket-types";

interface IMainPanel {
  tickets: ITicket[];
  submitRequestHandler: () => void;
}

const MainPanel: React.FC<IMainPanel> = (props) => {
  const { tickets, submitRequestHandler } = props;

  return (
    <>
      <div className="main-panel">
        <div>
          <Button icon="add" onClick={submitRequestHandler}>
            Submit Request
          </Button>
        </div>
        <div className="main-panel-container">
          <span className="main-panel-link">Placeholder Panel</span>
        </div>
      </div>
    </>
  );
};

export default MainPanel;
