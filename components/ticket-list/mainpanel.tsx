/**
 * This panel shows the stats on the main page with links to filters
 */
import { ITicket } from "ticket-types";

interface IMainPanel {
  tickets: ITicket[];
}

const MainPanel: React.FC<IMainPanel> = (props) => {
  const { tickets } = props;

  return (
    <div className="main-panel">
      <span className="main-panel-link">Placeholder Panel</span>
    </div>
  );
};

export default MainPanel;
