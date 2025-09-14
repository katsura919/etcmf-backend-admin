import { z } from 'zod';

// Base user schema with common fields
const baseUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  middleName: z.string().max(50, 'Middle name must be less than 50 characters').optional(),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  picture: z.string().url('Picture must be a valid URL').optional().or(z.literal(''))
});

// Role-specific field schemas
const driverFields = z.object({
  licenseNo: z.string().min(1, 'License number is required'),
  bday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Birthday must be in YYYY-MM-DD format'),
  nationality: z.string().min(1, 'Nationality is required'),
  address: z.string().min(1, 'Address is required')
});

const officerFields = z.object({
  contactNo: z.string().min(1, 'Contact number is required'),
  address: z.string().min(1, 'Address is required')
});

// Universal user registration schema
export const userRegisterSchema = z.object({
  body: z.discriminatedUnion('role', [
    // Admin schema
    baseUserSchema.extend({
      role: z.literal('admin')
    }),
    
    // Officer schema
    baseUserSchema.extend({
      role: z.literal('officer')
    }).merge(officerFields),
    
    // Driver schema
    baseUserSchema.extend({
      role: z.literal('driver')
    }).merge(driverFields)
  ])
});

// Role-specific registration schemas
export const adminRegisterSchema = z.object({
  body: baseUserSchema.omit({ picture: true }).extend({
    picture: z.string().url('Picture must be a valid URL').optional().or(z.literal(''))
  })
});

export const officerRegisterSchema = z.object({
  body: baseUserSchema.omit({ picture: true }).merge(officerFields).extend({
    picture: z.string().url('Picture must be a valid URL').optional().or(z.literal(''))
  })
});

export const driverRegisterSchema = z.object({
  body: baseUserSchema.omit({ picture: true }).merge(driverFields)
});

// Login schema
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
  })
});

// Profile schema (for protected routes)
export const profileSchema = z.object({
  headers: z.object({
    authorization: z.string().regex(/^Bearer /, 'Authorization header must start with "Bearer "')
  }).optional()
});

// Type exports for TypeScript
export type UserRegisterInput = z.infer<typeof userRegisterSchema>['body'];
export type AdminRegisterInput = z.infer<typeof adminRegisterSchema>['body'];
export type OfficerRegisterInput = z.infer<typeof officerRegisterSchema>['body'];
export type DriverRegisterInput = z.infer<typeof driverRegisterSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];

// Schema collection for easy import
export const authSchemas = {
  userRegister: userRegisterSchema,
  adminRegister: adminRegisterSchema,
  officerRegister: officerRegisterSchema,
  driverRegister: driverRegisterSchema,
  login: loginSchema,
  profile: profileSchema
};