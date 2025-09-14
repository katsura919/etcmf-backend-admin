import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, UserRole } from '../../models/userModel';
import { ApiResponse, UserRegisterRequest, LoginRequest } from '../../types';

interface AuthTokenPayload {
  id: string;
  role: UserRole;
}

export const registerUser = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    // Get validated data from Zod middleware
    const validatedData = (request as any).validatedData;
    const { 
      firstName, 
      lastName, 
      middleName, 
      email, 
      password, 
      role, 
      picture,
      licenseNo,
      bday,
      nationality,
      contactNo,
      address
    } = validatedData.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return reply.status(400).send({
        success: false,
        message: "User already exists"
      } as ApiResponse);
    }

    // For drivers, also check if license number already exists
    if (role === 'driver' && licenseNo) {
      const existingDriver = await User.findOne({ licenseNo, role: 'driver' });
      if (existingDriver) {
        return reply.status(400).send({
          success: false,
          message: "License number already exists"
        } as ApiResponse);
      }
    }

    // Create user data object
    const userData: any = {
      firstName,
      lastName,
      middleName,
      email,
      password,
      role,
      picture: picture || '',
    };

    // Add role-specific fields
    if (role === 'driver') {
      userData.licenseNo = licenseNo;
      userData.bday = bday ? new Date(bday) : undefined;
      userData.nationality = nationality;
      userData.address = address;
    } else if (role === 'officer') {
      userData.contactNo = contactNo;
      userData.address = address;
    }

    // Create new user
    const user = new User(userData);
    await user.save();

    reply.status(201).send({
      success: true,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: `${user.firstName}${user.middleName ? ' ' + user.middleName : ''} ${user.lastName}`
      }
    } as ApiResponse);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const loginUser = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    // Get validated data from Zod middleware
    const validatedData = (request as any).validatedData;
    const { email, password } = validatedData.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return reply.status(400).send({
        success: false,
        message: "Invalid credentials"
      } as ApiResponse);
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return reply.status(400).send({
        success: false,
        message: "Invalid credentials"
      } as ApiResponse);
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role } as AuthTokenPayload,
      jwtSecret,
      { expiresIn: "1h" }
    );

    reply.send({
      success: true,
      message: "Login successful",
      data: { 
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          fullName: `${user.firstName}${user.middleName ? ' ' + user.middleName : ''} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          picture: user.picture
        }
      }
    } as ApiResponse);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

// Role-specific registration helpers (optional convenience methods)
export const registerAdmin = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  // Get validated data from Zod middleware
  const validatedData = (request as any).validatedData;
  const adminRequest = {
    ...validatedData.body,
    role: 'admin' as UserRole
  };
  
  // Create a new request object with the role added
  const modifiedRequest = {
    ...request,
    validatedData: {
      body: adminRequest
    }
  };
  
  return registerUser(modifiedRequest as any, reply);
};

export const registerOfficer = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  // Get validated data from Zod middleware
  const validatedData = (request as any).validatedData;
  const officerRequest = {
    ...validatedData.body,
    role: 'officer' as UserRole
  };
  
  // Create a new request object with the role added
  const modifiedRequest = {
    ...request,
    validatedData: {
      body: officerRequest
    }
  };
  
  return registerUser(modifiedRequest as any, reply);
};

export const registerDriver = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  // Get validated data from Zod middleware
  const validatedData = (request as any).validatedData;
  const driverRequest = {
    ...validatedData.body,
    role: 'driver' as UserRole
  };
  
  // Create a new request object with the role added
  const modifiedRequest = {
    ...request,
    validatedData: {
      body: driverRequest
    }
  };
  
  return registerUser(modifiedRequest as any, reply);
};

// Get user profile
export const getUserProfile = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    // Assuming user ID is available from auth middleware
    const userId = (request as any).user?.id;
    
    if (!userId) {
      return reply.status(401).send({
        success: false,
        message: "Unauthorized"
      } as ApiResponse);
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return reply.status(404).send({
        success: false,
        message: "User not found"
      } as ApiResponse);
    }

    reply.send({
      success: true,
      message: "User profile retrieved successfully",
      data: user
    } as ApiResponse);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};