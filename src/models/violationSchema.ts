import mongoose, { Document, Schema } from 'mongoose';

export interface IViolation extends Document {
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const violationSchema = new Schema<IViolation>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

export const Violation = mongoose.model<IViolation>('Violation', violationSchema);
export default Violation;
