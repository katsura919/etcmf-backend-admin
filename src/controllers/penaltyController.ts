import { FastifyRequest, FastifyReply } from 'fastify';
import { Penalty } from '../models/penaltySchema';
import { 
  PenaltyData, 
  ApiResponse, 
  IdParams, 
  ViolationIdParams 
} from '../types';

export const createPenalty = async (
  request: FastifyRequest<{ Body: PenaltyData }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const penaltyData = request.body;

    // Verify that the violation exists
    const { Violation } = await import('../models/violationSchema');
    const violation = await Violation.findById(penaltyData.violationId);
    
    if (!violation) {
      return reply.status(400).send({
        success: false,
        message: 'Violation not found'
      } as ApiResponse);
    }

    const penalty = new Penalty(penaltyData);
    await penalty.save();

    // Populate the penalty with violation details
    const populatedPenalty = await Penalty.findById(penalty._id)
      .populate('violationId');

    reply.status(201).send({
      success: true,
      message: 'Penalty created successfully',
      data: populatedPenalty
    } as ApiResponse);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const getAllPenalties = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const penalties = await Penalty.find()
      .populate('violationId')
      .sort({ amount: 1 });
    
    reply.status(200).send({
      success: true,
      message: 'Penalties retrieved successfully',
      data: penalties
    } as ApiResponse);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const getPenaltyById = async (
  request: FastifyRequest<{ Params: IdParams }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { id } = request.params;
    const penalty = await Penalty.findById(id).populate('violationId');
    
    if (!penalty) {
      return reply.status(404).send({
        success: false,
        message: 'Penalty not found'
      } as ApiResponse);
    }

    reply.status(200).send({
      success: true,
      message: 'Penalty retrieved successfully',
      data: penalty
    } as ApiResponse);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const updatePenalty = async (
  request: FastifyRequest<{ Params: IdParams; Body: PenaltyData }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { id } = request.params;
    const penaltyData = request.body;

    // Verify that the violation exists if violationId is being updated
    if (penaltyData.violationId) {
      const { Violation } = await import('../models/violationSchema');
      const violation = await Violation.findById(penaltyData.violationId);
      
      if (!violation) {
        return reply.status(400).send({
          success: false,
          message: 'Violation not found'
        } as ApiResponse);
      }
    }

    const penalty = await Penalty.findByIdAndUpdate(
      id, 
      penaltyData, 
      { new: true }
    ).populate('violationId');

    if (!penalty) {
      return reply.status(404).send({
        success: false,
        message: 'Penalty not found'
      } as ApiResponse);
    }

    reply.status(200).send({
      success: true,
      message: 'Penalty updated successfully',
      data: penalty
    } as ApiResponse);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const deletePenalty = async (
  request: FastifyRequest<{ Params: IdParams }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { id } = request.params;
    const penalty = await Penalty.findByIdAndDelete(id);
    
    if (!penalty) {
      return reply.status(404).send({
        success: false,
        message: 'Penalty not found'
      } as ApiResponse);
    }

    reply.status(200).send({
      success: true,
      message: 'Penalty deleted successfully'
    } as ApiResponse);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const getPenaltiesByViolation = async (
  request: FastifyRequest<{ Params: ViolationIdParams }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { violationId } = request.params;

    // Verify that the violation exists
    const { Violation } = await import('../models/violationSchema');
    const violation = await Violation.findById(violationId);
    
    if (!violation) {
      return reply.status(404).send({
        success: false,
        message: 'Violation not found'
      } as ApiResponse);
    }

    const penalties = await Penalty.find({ violationId })
      .populate('violationId')
      .sort({ amount: 1 });
    
    if (penalties.length === 0) {
      return reply.status(404).send({
        success: false,
        message: 'No penalties found for this violation'
      } as ApiResponse);
    }

    reply.status(200).send({
      success: true,
      message: `Found ${penalties.length} penalty/penalties for this violation`,
      data: penalties
    } as ApiResponse);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: 'Server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};
