import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'admin' | 'officer' | 'driver';

export interface IUser extends Document {
  // Common fields for all users
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  password: string;
  role: UserRole;
  picture?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Driver-specific fields
  licenseNo?: string;
  bday?: Date;
  nationality?: string;
  
  // Officer-specific fields
  contactNo?: string;
  
  // Common fields with different requirements per role
  address?: string; // Required for drivers and officers, optional for admins
  
  // Virtual fields
  fullName: string;
  
  // Methods
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
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
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'officer', 'driver'],
    required: true,
  },
  picture: {
    type: String,
    default: '',
  },
  
  // Driver-specific fields
  licenseNo: {
    type: String,
    unique: true,
    sparse: true, // Allows null values to be non-unique
    validate: {
      validator: function(this: IUser, value: string) {
        // License number is required only for drivers
        if (this.role === 'driver') {
          return !!value;
        }
        return true;
      },
      message: 'License number is required for drivers'
    }
  },
  bday: {
    type: Date,
    validate: {
      validator: function(this: IUser, value: Date) {
        // Birthday is required only for drivers
        if (this.role === 'driver') {
          return !!value;
        }
        return true;
      },
      message: 'Birthday is required for drivers'
    }
  },
  nationality: {
    type: String,
    validate: {
      validator: function(this: IUser, value: string) {
        // Nationality is required only for drivers
        if (this.role === 'driver') {
          return !!value;
        }
        return true;
      },
      message: 'Nationality is required for drivers'
    }
  },
  
  // Officer-specific fields
  contactNo: {
    type: String,
    trim: true,
    validate: {
      validator: function(this: IUser, value: string) {
        // Contact number is required only for officers
        if (this.role === 'officer') {
          return !!value;
        }
        return true;
      },
      message: 'Contact number is required for officers'
    }
  },
  
  // Address field (required for drivers and officers)
  address: {
    type: String,
    trim: true,
    validate: {
      validator: function(this: IUser, value: string) {
        // Address is required for drivers and officers
        if (this.role === 'driver' || this.role === 'officer') {
          return !!value;
        }
        return true;
      },
      message: 'Address is required for drivers and officers'
    }
  }
}, {
  timestamps: true,
});

// Compound index for role-based queries
userSchema.index({ role: 1, email: 1 });
userSchema.index({ role: 1, licenseNo: 1 });

// Hash password before saving
userSchema.pre<IUser>('save', async function (next) {
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
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Virtual for full name
userSchema.virtual('fullName').get(function(this: IUser) {
  const middle = this.middleName ? ` ${this.middleName}` : '';
  return `${this.firstName}${middle} ${this.lastName}`;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password; // Never return password in JSON
    return ret;
  }
});

export const User = mongoose.model<IUser>('User', userSchema);
export default User;