import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IOfficer extends Document {
  role: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  address: string;
  contactNo: string;
  email: string;
  picture?: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const officerSchema = new Schema<IOfficer>({
  role: {
    type: String,
    required: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  middleName: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  contactNo: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  picture: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Hash password before saving
officerSchema.pre<IOfficer>('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password for login
officerSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const Officer = mongoose.model<IOfficer>('Officer', officerSchema);
export default Officer;
