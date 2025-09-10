import mongoose, { Document, Schema } from 'mongoose';

export type TicketStatus = 'Pending' | 'Paid' | 'Dismissed';

export interface ITicket extends Document {
  driverId: mongoose.Types.ObjectId;
  officerId: mongoose.Types.ObjectId;
  trafficViolationId: mongoose.Types.ObjectId;
  status: TicketStatus;
  location: string;
  signature?: string;
  timestamp: Date;
}

const ticketSchema = new Schema<ITicket>({
  driverId: {
    type: Schema.Types.ObjectId,
    ref: 'Driver',
    required: true,
  },
  officerId: {
    type: Schema.Types.ObjectId,
    ref: 'Officer',
    required: true,
  },
  trafficViolationId: {
    type: Schema.Types.ObjectId,
    ref: 'TrafficViolation',
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Dismissed'],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  signature: {
    type: String,
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

export const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema);
export default Ticket;
