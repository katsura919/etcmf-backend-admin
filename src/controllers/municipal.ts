import { FastifyRequest, FastifyReply } from 'fastify';
import { Municipal } from '../models/municipalSchema';
import { MunicipalData, ApiResponse, IdParams } from '../types';

export const createMunicipal = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { name, address } = request.body as MunicipalData;

    // Check if municipal with same name already exists
    const existingMunicipal = await Municipal.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });

    if (existingMunicipal) {
      return reply.status(400).send({
        success: false,
        message: 'Municipal with this name already exists'
      } as ApiResponse);
    }

    const municipal = new Municipal({ name, address });
    await municipal.save();

    reply.status(201).send({
      success: true,
      message: 'Municipal created successfully',
      data: municipal
    } as ApiResponse);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: 'Error creating municipal',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const getAllMunicipals = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const municipals = await Municipal.find().sort({ name: 1 });
    
    reply.status(200).send({
      success: true,
      message: 'Municipals retrieved successfully',
      data: municipals
    } as ApiResponse);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: 'Error fetching municipals',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const getMunicipalById = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { id } = request.params as IdParams;
    const municipal = await Municipal.findById(id);
    
    if (!municipal) {
      return reply.status(404).send({
        success: false,
        message: 'Municipal not found'
      } as ApiResponse);
    }

    reply.status(200).send({
      success: true,
      message: 'Municipal retrieved successfully',
      data: municipal
    } as ApiResponse);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: 'Error fetching municipal',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const updateMunicipal = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { id } = request.params as IdParams;
    const { name, address } = request.body as MunicipalData;

    // Check if another municipal with same name exists (excluding current one)
    const existingMunicipal = await Municipal.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      _id: { $ne: id }
    });

    if (existingMunicipal) {
      return reply.status(400).send({
        success: false,
        message: 'Another municipal with this name already exists'
      } as ApiResponse);
    }

    const municipal = await Municipal.findByIdAndUpdate(
      id, 
      { name, address }, 
      { new: true }
    );

    if (!municipal) {
      return reply.status(404).send({
        success: false,
        message: 'Municipal not found'
      } as ApiResponse);
    }

    reply.status(200).send({
      success: true,
      message: 'Municipal updated successfully',
      data: municipal
    } as ApiResponse);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: 'Error updating municipal',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const deleteMunicipal = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { id } = request.params as IdParams;
    const municipal = await Municipal.findByIdAndDelete(id);
    
    if (!municipal) {
      return reply.status(404).send({
        success: false,
        message: 'Municipal not found'
      } as ApiResponse);
    }

    reply.status(200).send({
      success: true,
      message: 'Municipal deleted successfully'
    } as ApiResponse);
  } catch (error) {
    reply.status(500).send({
      success: false,
      message: 'Error deleting municipal',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};
