import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IDriver extends Document {
  licenseNo: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  address: string;
  bday: Date;
  nationality: string;
  email: string;
  password: string;
  comparePassword(password: string): Promise<boolean>;
}

const driverSchema = new Schema<IDriver>({
  licenseNo: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  middleName: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: true
  },
  bday: {
    type: Date,
    required: true
  },
  nationality: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Encrypt password before saving
driverSchema.pre<IDriver>('save', async function (next) {
  if (this.isModified('password')) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
      next();
    } catch (error) {
      next(error as Error);
    }
  } else {
    next();
  }
});

// Compare password for login
driverSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const Driver = mongoose.model<IDriver>('Driver', driverSchema);
export default Driver;
