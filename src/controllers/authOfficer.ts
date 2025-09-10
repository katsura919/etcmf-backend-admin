import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Officer } from '../models/officerSchema';
import { OfficerData, LoginRequest, ApiResponse } from '../types';

interface OfficerResponse {
  id: string;
  role: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  address: string;
  contactNo: string;
  email: string;
  picture?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthTokenPayload {
  id: string;
}

export const loginOfficer = async (
  request: FastifyRequest<{ Body: LoginRequest }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { email, password } = request.body;
    
    // Find officer by email
    const officer = await Officer.findOne({ email });
    if (!officer) {
      return reply.status(400).send({
        success: false,
        message: "Invalid credentials"
      } as ApiResponse);
    }

    // Compare password using the schema method
    const isMatch = await officer.comparePassword(password);
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
      { id: officer.id } as AuthTokenPayload,
      jwtSecret,
      { expiresIn: "1h" }
    );

    const officerResponse: OfficerResponse = {
      id: officer.id,
      role: officer.role,
      firstName: officer.firstName,
      lastName: officer.lastName,
      middleName: officer.middleName,
      address: officer.address,
      contactNo: officer.contactNo,
      email: officer.email,
      picture: officer.picture,
      createdAt: officer.createdAt,
      updatedAt: officer.updatedAt
    };

    reply.send({
      success: true,
      message: "Login successful",
      data: {
        token,
        officer: officerResponse
      }
    } as ApiResponse<{ token: string; officer: OfficerResponse }>);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const registerOfficer = async (
  request: FastifyRequest<{ Body: OfficerData }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const {
      role,
      firstName,
      lastName,
      middleName,
      address,
      contactNo,
      email,
      password,
      picture
    } = request.body;

    // Check if officer already exists
    const existingOfficer = await Officer.findOne({ email });
    if (existingOfficer) {
      return reply.status(400).send({
        success: false,
        message: "Officer already exists"
      } as ApiResponse);
    }

    // Create new officer (password will be hashed by the schema pre-save hook)
    const officer = new Officer({
      role,
      firstName,
      lastName,
      middleName,
      address,
      contactNo,
      email,
      password,
      picture
    });

    await officer.save();

    reply.status(201).send({
      success: true,
      message: "Officer registered successfully"
    } as ApiResponse);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};
