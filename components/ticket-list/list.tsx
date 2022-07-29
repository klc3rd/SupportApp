/**
 * Show list of tickets
 */
import { ITicket } from "ticket-types";
import ListItem from "./listitem";

interface ITicketList {
  tickets: ITicket[];
}

const TicketList: React.FC<ITicketList> = (props) => {
  const { tickets } = props;

  const sortedTickets = tickets.sort(function (a, b) {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  let count = 1; // Start a counter for alternating grey in list items

  return (
    <>
      <div className="ticket-list">
        <div className="ticket-list-cell ticket-list-cell_header ticket-list-cell-ticketnumber">
          Number
        </div>
        <div className="ticket-list-cell ticket-list-cell_header ticket-list-cell-status">
          Status
        </div>
        <div className="ticket-list-cell ticket-list-cell_header ticket-list-cell-issue">
          Issue
        </div>
        <div className="ticket-list-cell ticket-list-cell_header ticket-list-cell-date">
          Date
        </div>
        {sortedTickets.map((ticket) => {
          let color = false;
          if (count % 2 == 0) {
            color = true;
          }
          count++;

          return (
            <ListItem
              key={ticket._id}
              id={ticket._id!}
              number={ticket.number}
              status={ticket.status!}
              issue={ticket.summary}
              date={ticket.date}
              color={color}
            />
          );
        })}
      </div>
    </>
  );
};

TicketList.displayName = "TicketList";
export default TicketList;
