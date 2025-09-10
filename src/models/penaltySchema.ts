import mongoose, { Document, Schema } from 'mongoose';

export interface IPenalty extends Document {
  violationId: mongoose.Types.ObjectId;
  description: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const penaltySchema = new Schema<IPenalty>({
  violationId: {
    type: Schema.Types.ObjectId,
    ref: 'Violation',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true
});

export const Penalty = mongoose.model<IPenalty>('Penalty', penaltySchema);
export default Penalty;
