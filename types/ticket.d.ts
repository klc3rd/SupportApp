// Contains type definitions meant for managing tickets
declare module "ticket" {
  // An open ticket is anything that is not in closed status
  enum Status {
    Closed = 0,
    AwaitingUserResponse = 1,
    AwaitingTechniciansResponse = 2,
  }
}
