import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/adminSchema';
import { RegisterRequest, LoginRequest, ApiResponse } from '../types';

interface AuthTokenPayload {
  id: string;
}

export const registerAdmin = async (
  request: FastifyRequest<{ Body: RegisterRequest }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { firstname, lastname, middlename, email, password, picture } = request.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return reply.status(400).send({
        success: false,
        message: "Admin already exists"
      } as ApiResponse);
    }

    // Create new admin
    const admin = new Admin({
      firstname,
      lastname,
      middlename,
      email,
      password,
      picture: picture || '',
    });

    await admin.save();

    reply.status(201).send({
      success: true,
      message: "Admin registered successfully"
    } as ApiResponse);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const loginAdmin = async (
  request: FastifyRequest<{ Body: LoginRequest }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { email, password } = request.body;
    
    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return reply.status(400).send({
        success: false,
        message: "Invalid credentials"
      } as ApiResponse);
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
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
      { id: admin.id } as AuthTokenPayload,
      jwtSecret,
      { expiresIn: "1h" }
    );

    reply.send({
      success: true,
      message: "Login successful",
      data: { token }
    } as ApiResponse<{ token: string }>);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};
