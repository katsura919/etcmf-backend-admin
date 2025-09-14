import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import mongoose from 'mongoose';
import { UserRole } from '../models/userModel';

// Common types for request/response
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Model-related types (re-export from models)
export type TicketStatus = 'Pending' | 'Paid' | 'Dismissed';
export { UserRole } from '../models/userModel';

// Unified User types
export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  role: UserRole;
  picture?: string;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Driver-specific fields
  licenseNo?: string;
  bday?: Date;
  nationality?: string;
  
  // Officer-specific fields
  contactNo?: string;
  
  // Address field
  address?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserRegisterRequest {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  password: string;
  role: UserRole;
  picture?: string;
  
  // Driver-specific fields
  licenseNo?: string;
  bday?: string;
  nationality?: string;
  
  // Officer-specific fields
  contactNo?: string;
  
  // Address field
  address?: string;
}

// Legacy types (deprecated - use UserData instead)
export interface AdminData {
  id: string;
  firstname: string;
  lastname: string;
  middlename?: string;
  email: string;
  picture?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RegisterRequest {
  firstname: string;
  lastname: string;
  middlename?: string;
  email: string;
  password: string;
  picture?: string;
}

// Officer related types (legacy)
export interface OfficerData {
  role: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  address: string;
  contactNo: string;
  email: string;
  picture?: string;
  password: string;
}

// Ticket related types
export interface DriverData {
  licenseNo: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  address: string;
  bday: Date;
  nationality: string;
  email: string;
  password: string;
}

export interface VehicleData {
  driverId: string;
  ownerId: string;
  plateNumber: string;
  make: string;
  class: string;
  vehicleModel: string;
  color: string;
  markings?: string;
}

export interface OwnerData {
  firstname: string;
  lastname: string;
  middlename?: string;
  address: string;
}

export interface ViolationData {
  title: string;
  description: string;
}

export interface PenaltyData {
  violationId: string;
  description: string;
  amount: number;
}

export interface TicketData {
  driverId: string;
  officerId: string;
  trafficViolationId: string;
  status: TicketStatus;
  location: string;
  signature?: string;
}

export interface TrafficViolationData {
  ticketId: string;
  violationId: string;
}

export interface MunicipalData {
  name: string;
  address: string;
}

// Search/Query types
export interface DriverSearchQuery {
  licenseNo?: string;
}

export interface VehicleSearchQuery {
  plateNumber?: string;
}

export interface ViolationSearchQuery {
  title?: string;
}

// Fastify plugin type
export type FastifyRoutePlugin = FastifyPluginAsync;

// Request parameter types
export interface IdParams {
  id: string;
}

export interface ViolationIdParams {
  violationId: string;
}
