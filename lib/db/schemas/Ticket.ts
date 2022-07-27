import { ITicket } from "ticket-types";
import mongoose from "mongoose";

import { Status } from "../../enums/ticket-status";

const TicketSchema = new mongoose.Schema<ITicket>({
  poster_id: { type: String, required: true },
  assigned_id: { type: String },
  date: { type: String, required: true },
  number: { type: String, required: true, unique: true },
  device: { type: String, required: true },
  summary: { type: String, required: true },
  issue: { type: String, required: true },
  steps: { type: String },
  status: {
    type: Number,
    required: true,
    default: Status.Unassigned,
  },
});

const TicketModel: mongoose.Model<ITicket> =
  mongoose.models?.Tickets || mongoose.model<ITicket>("Tickets", TicketSchema);
export default TicketModel;
