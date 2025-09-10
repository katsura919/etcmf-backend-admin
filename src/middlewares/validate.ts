import { FastifyRequest, FastifyReply } from 'fastify';
import S from 'fluent-json-schema';
import { ApiResponse } from '../types';

// Generic validation middleware
export const validate = (schema: any) => {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      // Fastify handles validation automatically when schemas are attached to routes
      // This middleware is for custom validation logic if needed
    } catch (error) {
      return reply.status(400).send({
        success: false,
        message: "Validation error",
        error: error instanceof Error ? error.message : 'Unknown validation error'
      } as ApiResponse);
    }
  };
};

// Common validation schemas
export const schemas = {
  // Admin schemas
  adminRegister: {
    body: S.object()
      .prop('firstname', S.string().minLength(1).maxLength(50).required())
      .prop('lastname', S.string().minLength(1).maxLength(50).required())
      .prop('middlename', S.string().maxLength(50))
      .prop('email', S.string().format('email').required())
      .prop('password', S.string().minLength(8).required())
      .prop('picture', S.string())
  },

  adminLogin: {
    body: S.object()
      .prop('email', S.string().format('email').required())
      .prop('password', S.string().required())
  },

  adminUpdate: {
    body: S.object()
      .prop('firstname', S.string().minLength(1).maxLength(50).required())
      .prop('lastname', S.string().minLength(1).maxLength(50).required())
      .prop('middlename', S.string().maxLength(50))
      .prop('email', S.string().format('email').required())
  },

  // Officer schemas
  officerRegister: {
    body: S.object()
      .prop('role', S.string().minLength(1).required())
      .prop('firstName', S.string().minLength(1).maxLength(50).required())
      .prop('lastName', S.string().minLength(1).maxLength(50).required())
      .prop('middleName', S.string().maxLength(50))
      .prop('address', S.string().minLength(1).required())
      .prop('contactNo', S.string().minLength(1).required())
      .prop('email', S.string().format('email').required())
      .prop('password', S.string().minLength(8).required())
      .prop('picture', S.string())
  },

  // Driver schemas
  driverCreate: {
    body: S.object()
      .prop('licenseNo', S.string().minLength(1).required())
      .prop('firstName', S.string().minLength(1).maxLength(50).required())
      .prop('lastName', S.string().minLength(1).maxLength(50).required())
      .prop('middleName', S.string().maxLength(50))
      .prop('address', S.string().minLength(1).required())
      .prop('bday', S.string().format('date').required())
      .prop('nationality', S.string().minLength(1).required())
      .prop('email', S.string().format('email').required())
      .prop('password', S.string().minLength(8).required())
  },

  // Vehicle schemas
  vehicleCreate: {
    body: S.object()
      .prop('driverId', S.string().required())
      .prop('ownerId', S.string().required())
      .prop('plateNumber', S.string().minLength(1).required())
      .prop('make', S.string().minLength(1).required())
      .prop('class', S.string().minLength(1).required())
      .prop('vehicleModel', S.string().minLength(1).required())
      .prop('color', S.string().minLength(1).required())
      .prop('markings', S.string())
  },

  // Violation schemas
  violationCreate: {
    body: S.object()
      .prop('title', S.string().minLength(1).maxLength(100).required())
      .prop('description', S.string().minLength(1).required())
  },

  // Penalty schemas
  penaltyCreate: {
    body: S.object()
      .prop('violationId', S.string().required())
      .prop('description', S.string().minLength(1).required())
      .prop('amount', S.number().minimum(0).required())
  },

  // Municipal schemas
  municipalCreate: {
    body: S.object()
      .prop('name', S.string().minLength(1).maxLength(100).required())
      .prop('address', S.string().minLength(1).required())
  },

  // Ticket schemas
  ticketCreate: {
    body: S.object()
      .prop('ticketData', S.object()
        .prop('driverId', S.string().required())
        .prop('officerId', S.string().required())
        .prop('trafficViolationId', S.string().required())
        .prop('status', S.string().enum(['Pending', 'Paid', 'Dismissed']).required())
        .prop('location', S.string().minLength(1).required())
        .prop('signature', S.string())
      )
      .prop('violationIds', S.array().items(S.string()).minItems(1).required())
  },

  // ID parameter schema
  idParam: {
    params: S.object()
      .prop('id', S.string().required())
  },

  // Search schemas
  driverSearch: {
    querystring: S.object()
      .prop('licenseNo', S.string().required())
  },

  vehicleSearch: {
    querystring: S.object()
      .prop('plateNumber', S.string().required())
  },

  violationSearch: {
    querystring: S.object()
      .prop('title', S.string().required())
  }
};

export default validate;
