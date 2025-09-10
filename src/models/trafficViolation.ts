import mongoose, { Document, Schema } from 'mongoose';

export interface ITrafficViolation extends Document {
  ticketId: mongoose.Types.ObjectId;
  violationId: mongoose.Types.ObjectId;
}

const trafficViolationSchema = new Schema<ITrafficViolation>({
  ticketId: {
    type: Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true,
  },
  violationId: {
    type: Schema.Types.ObjectId,
    ref: 'Violation',
    required: true,
  }
});

export const TrafficViolation = mongoose.model<ITrafficViolation>('TrafficViolation', trafficViolationSchema);
export default TrafficViolation;
