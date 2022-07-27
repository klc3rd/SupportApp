import Status from "../../lib/enums/ticket-status";
import Link from "next/link";

interface IListItem {
  id: string;
  number: string;
  status: number;
  issue: string;
  date: string;
  color: boolean;
}

const ListItem: React.FC<IListItem> = (props) => {
  const { id, number, status, issue, date, color } = props;

  // Convert status number to a string
  let statusString;
  switch (status) {
    case Status.Closed:
      statusString = "Closed";
      break;
    case Status.Unassigned:
      statusString = "Unassigned";
      break;
    case Status.AwaitingUserResponse:
      statusString = "Awaiting User Response";
      break;
    case Status.AwaitingTechniciansResponse:
      statusString = "Awaiting Tech Response";
      break;
  }

  // Convert date to a readable string
  const shortDate = new Date(date);

  return (
    <>
      <div
        className={`ticket-list-cell ticket-list-cell-ticketnumber ${
          color && `ticket-list-cell-grey`
        }`}
      >
        <Link href={`/tickets/${id}`}>
          <span className="ticket-link">{number}</span>
        </Link>
      </div>
      <div
        className={`ticket-list-cell ticket-list-cell-status ${
          color && `ticket-list-cell-grey`
        }`}
      >
        {" "}
        {statusString}
      </div>
      <div
        className={`ticket-list-cell ticket-list-cell-issue ${
          color && `ticket-list-cell-grey`
        }`}
      >
        {issue}
      </div>
      <div
        className={`ticket-list-cell ticket-list-cell-date ${
          color && `ticket-list-cell-grey`
        }`}
      >
        {shortDate.toLocaleDateString()}
      </div>
    </>
  );
};

ListItem.displayName = "ListItem";
export default ListItem;
