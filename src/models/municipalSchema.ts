import mongoose, { Document, Schema } from 'mongoose';

export interface IMunicipal extends Document {
  name: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

const municipalSchema = new Schema<IMunicipal>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export const Municipal = mongoose.model<IMunicipal>('Municipal', municipalSchema);
export default Municipal;
