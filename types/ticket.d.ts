// Contains type definitions meant for managing tickets
declare module "ticket-types" {
  // An open ticket is anything that is not in closed status
  interface ITicket {
    poster_id: string;
    assigned_id?: string;
    number: string;
    device: string;
    summary: string;
    issue: string;
    steps?: string;
    status?: number;
  }
}
