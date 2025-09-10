import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../types';

// Extend FastifyRequest to include admin data
declare module 'fastify' {
  interface FastifyRequest {
    admin?: {
      id: string;
    };
    officer?: {
      id: string;
    };
  }
}

interface JWTPayload {
  id: string;
  iat?: number;
  exp?: number;
}

export const authMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      return reply.status(401).send({
        success: false,
        message: "Access denied, no token provided"
      } as ApiResponse);
    }

    // Extract token from "Bearer TOKEN" format
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    // Verify token
    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    
    // Add admin data to request
    request.admin = { id: decoded.id };
    
  } catch (error) {
    return reply.status(401).send({
      success: false,
      message: "Invalid or expired token"
    } as ApiResponse);
  }
};

// Officer authentication middleware
export const authOfficerMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      return reply.status(401).send({
        success: false,
        message: "Access denied, no token provided"
      } as ApiResponse);
    }

    // Extract token from "Bearer TOKEN" format
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    // Verify token
    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    
    // Add officer data to request
    request.officer = { id: decoded.id };
    
  } catch (error) {
    return reply.status(401).send({
      success: false,
      message: "Invalid or expired token"
    } as ApiResponse);
  }
};

export default authMiddleware;
