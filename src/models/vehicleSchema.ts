import mongoose, { Document, Schema } from 'mongoose';

export interface IVehicle extends Document {
  driverId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  plateNumber: string;
  make: string;
  class: string;
  vehicleModel: string;
  color: string;
  markings?: string;
  createdAt: Date;
  updatedAt: Date;
}

const vehicleSchema = new Schema<IVehicle>({
  driverId: {
    type: Schema.Types.ObjectId,
    ref: 'Driver',
    required: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'Owner',
    required: true,
  },
  plateNumber: {
    type: String,
    required: true,
    unique: true,
  },
  make: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  vehicleModel: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  markings: {
    type: String,
  },
}, {
  timestamps: true,
});

export const Vehicle = mongoose.model<IVehicle>('Vehicle', vehicleSchema);
export default Vehicle;
