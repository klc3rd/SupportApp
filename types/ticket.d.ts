// Contains type definitions meant for managing tickets
declare module "ticket-types" {
  // An open ticket is anything that is not in closed status
  interface ITicket {
    _id?: string;
    poster_id: string;
    assigned_id?: string;
    date: string;
    number: string;
    device: string;
    summary: string;
    issue: string;
    steps?: string;
    status?: number;
  }

  // Posts are responses to tickets
  interface IPost {
    _id?: string;
    ticket_id: string;
    poster_id: string;
    date: string;
    message: string;
  }
}
