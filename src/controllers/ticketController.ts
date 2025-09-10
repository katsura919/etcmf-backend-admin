import { FastifyRequest, FastifyReply } from 'fastify';
import { Driver } from '../models/driverSchema';
import { Vehicle } from '../models/vehicleSchema';
import { Violation } from '../models/violationSchema';
import { Ticket } from '../models/ticketSchema';
import { 
  DriverData, 
  VehicleData, 
  TicketData, 
  ApiResponse,
  DriverSearchQuery,
  VehicleSearchQuery
} from '../types';

interface CreateTicketBody {
  ticketData: TicketData;
  violationIds: string[];
}

export const searchDriver = async (
  request: FastifyRequest<{ Querystring: DriverSearchQuery }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { licenseNo } = request.query;

    if (!licenseNo) {
      return reply.status(400).send({
        success: false,
        message: 'License number is required'
      } as ApiResponse);
    }

    const driver = await Driver.findOne({ licenseNo }).select('-password');
    if (driver) {
      return reply.status(200).send({
        success: true,
        message: 'Driver found',
        data: driver
      } as ApiResponse);
    }

    reply.status(404).send({
      success: false,
      message: 'Driver not found'
    } as ApiResponse);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const createDriver = async (
  request: FastifyRequest<{ Body: DriverData }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const driverData = request.body;

    // Check if driver already exists
    const existingDriver = await Driver.findOne({ 
      $or: [
        { licenseNo: driverData.licenseNo },
        { email: driverData.email }
      ]
    });

    if (existingDriver) {
      return reply.status(400).send({
        success: false,
        message: 'Driver with this license number or email already exists'
      } as ApiResponse);
    }

    const driver = new Driver(driverData);
    await driver.save();

    // Remove password from response
    const { password, ...driverResponse } = driver.toObject();

    reply.status(201).send({
      success: true,
      message: 'Driver profile created successfully',
      data: driverResponse
    } as ApiResponse);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const searchVehicle = async (
  request: FastifyRequest<{ Querystring: VehicleSearchQuery }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { plateNumber } = request.query;

    if (!plateNumber) {
      return reply.status(400).send({
        success: false,
        message: 'Plate number is required'
      } as ApiResponse);
    }

    const vehicle = await Vehicle.findOne({ plateNumber })
      .populate('driverId', '-password')
      .populate('ownerId');

    if (vehicle) {
      return reply.status(200).send({
        success: true,
        message: 'Vehicle found',
        data: vehicle
      } as ApiResponse);
    }

    reply.status(404).send({
      success: false,
      message: 'Vehicle not found'
    } as ApiResponse);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const createVehicle = async (
  request: FastifyRequest<{ Body: VehicleData }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const vehicleData = request.body;

    // Check if vehicle already exists
    const existingVehicle = await Vehicle.findOne({ plateNumber: vehicleData.plateNumber });
    if (existingVehicle) {
      return reply.status(400).send({
        success: false,
        message: 'Vehicle with this plate number already exists'
      } as ApiResponse);
    }

    const vehicle = new Vehicle(vehicleData);
    await vehicle.save();

    // Populate the created vehicle
    const populatedVehicle = await Vehicle.findById(vehicle._id)
      .populate('driverId', '-password')
      .populate('ownerId');

    reply.status(201).send({
      success: true,
      message: 'Vehicle information created successfully',
      data: populatedVehicle
    } as ApiResponse);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const fetchViolations = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const violations = await Violation.find().sort({ title: 1 });
    
    reply.status(200).send({
      success: true,
      message: 'Violations retrieved successfully',
      data: violations
    } as ApiResponse);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const createTicket = async (
  request: FastifyRequest<{ Body: CreateTicketBody }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { ticketData, violationIds } = request.body;

    if (!violationIds || violationIds.length === 0) {
      return reply.status(400).send({
        success: false,
        message: 'At least one violation must be selected'
      } as ApiResponse);
    }

    // Verify that all violation IDs exist
    const violations = await Violation.find({ _id: { $in: violationIds } });
    if (violations.length !== violationIds.length) {
      return reply.status(400).send({
        success: false,
        message: 'One or more violation IDs are invalid'
      } as ApiResponse);
    }

    const ticket = new Ticket(ticketData);
    await ticket.save();

    // Create traffic violations for each violation
    const { TrafficViolation } = await import('../models/trafficViolation');
    await Promise.all(
      violationIds.map(async (violationId) => {
        const trafficViolation = new TrafficViolation({
          ticketId: ticket._id,
          violationId: violationId
        });
        await trafficViolation.save();
      })
    );

    // Populate the ticket with related data
    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('driverId', '-password')
      .populate('officerId', '-password')
      .populate('trafficViolationId');

    reply.status(201).send({
      success: true,
      message: 'Ticket created successfully',
      data: {
        ticket: populatedTicket,
        violationIds: violationIds
      }
    } as ApiResponse);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};
