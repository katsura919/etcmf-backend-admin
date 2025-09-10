import { FastifyRequest, FastifyReply } from 'fastify';
import { Violation } from '../models/violationSchema';
import { 
  ViolationData, 
  ApiResponse, 
  IdParams, 
  ViolationSearchQuery 
} from '../types';

export const createViolation = async (
  request: FastifyRequest<{ Body: ViolationData }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const violationData = request.body;

    // Check if violation with same title already exists
    const existingViolation = await Violation.findOne({ 
      title: { $regex: new RegExp(`^${violationData.title}$`, 'i') }
    });

    if (existingViolation) {
      return reply.status(400).send({
        success: false,
        message: 'Violation with this title already exists'
      } as ApiResponse);
    }

    const violation = new Violation(violationData);
    await violation.save();

    reply.status(201).send({
      success: true,
      message: 'Violation created successfully',
      data: violation
    } as ApiResponse);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const getAllViolations = async (
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

export const getViolationById = async (
  request: FastifyRequest<{ Params: IdParams }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { id } = request.params;
    const violation = await Violation.findById(id);
    
    if (!violation) {
      return reply.status(404).send({
        success: false,
        message: 'Violation not found'
      } as ApiResponse);
    }

    reply.status(200).send({
      success: true,
      message: 'Violation retrieved successfully',
      data: violation
    } as ApiResponse);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const updateViolation = async (
  request: FastifyRequest<{ Params: IdParams; Body: ViolationData }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { id } = request.params;
    const violationData = request.body;

    // Check if another violation with same title exists (excluding current one)
    const existingViolation = await Violation.findOne({ 
      title: { $regex: new RegExp(`^${violationData.title}$`, 'i') },
      _id: { $ne: id }
    });

    if (existingViolation) {
      return reply.status(400).send({
        success: false,
        message: 'Another violation with this title already exists'
      } as ApiResponse);
    }

    const violation = await Violation.findByIdAndUpdate(
      id, 
      violationData, 
      { new: true }
    );

    if (!violation) {
      return reply.status(404).send({
        success: false,
        message: 'Violation not found'
      } as ApiResponse);
    }

    reply.status(200).send({
      success: true,
      message: 'Violation updated successfully',
      data: violation
    } as ApiResponse);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const deleteViolation = async (
  request: FastifyRequest<{ Params: IdParams }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { id } = request.params;

    // Check if violation is being used in any penalties
    const { Penalty } = await import('../models/penaltySchema');
    const relatedPenalties = await Penalty.find({ violationId: id });
    
    if (relatedPenalties.length > 0) {
      return reply.status(400).send({
        success: false,
        message: 'Cannot delete violation. It is being used in penalty records.'
      } as ApiResponse);
    }

    const violation = await Violation.findByIdAndDelete(id);
    
    if (!violation) {
      return reply.status(404).send({
        success: false,
        message: 'Violation not found'
      } as ApiResponse);
    }

    reply.status(200).send({
      success: true,
      message: 'Violation deleted successfully'
    } as ApiResponse);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const searchViolation = async (
  request: FastifyRequest<{ Querystring: ViolationSearchQuery }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { title } = request.query;

    if (!title) {
      return reply.status(400).send({
        success: false,
        message: 'Search title is required'
      } as ApiResponse);
    }

    const violations = await Violation.find({ 
      title: { $regex: new RegExp(title, 'i') }
    }).sort({ title: 1 });

    if (violations.length > 0) {
      return reply.status(200).send({
        success: true,
        message: `Found ${violations.length} violation(s)`,
        data: violations
      } as ApiResponse);
    }

    reply.status(404).send({
      success: false,
      message: 'No violations found'
    } as ApiResponse);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};
