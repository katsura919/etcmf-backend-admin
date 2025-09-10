import mongoose, { Document, Schema } from 'mongoose';

export interface IOwner extends Document {
  firstname: string;
  lastname: string;
  middlename?: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

const ownerSchema = new Schema<IOwner>({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  middlename: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export const Owner = mongoose.model<IOwner>('Owner', ownerSchema);
export default Owner;
