import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodSchema, ZodError } from 'zod';
import { ApiResponse } from '../../types';

// Custom Zod validation middleware
export const zodValidation = (schema: ZodSchema) => {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      // Validate the request against the schema
      const validationData = {
        body: request.body,
        query: request.query,
        params: request.params,
        headers: request.headers
      };

      // Only validate parts that exist in the schema
      const schemaShape = (schema as any)._def.shape;
      const dataToValidate: any = {};
      
      if (schemaShape?.body) dataToValidate.body = validationData.body;
      if (schemaShape?.query) dataToValidate.query = validationData.query;
      if (schemaShape?.params) dataToValidate.params = validationData.params;
      if (schemaShape?.headers) dataToValidate.headers = validationData.headers;

      const validatedData = schema.parse(dataToValidate);
      
      // Attach validated data to request
      (request as any).validatedData = validatedData;
      
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(', ');
        return reply.status(400).send({
          success: false,
          message: "Validation error",
          error: errorMessage,
          details: error.issues
        } as ApiResponse);
      }
      
      return reply.status(500).send({
        success: false,
        message: "Internal validation error",
        error: error instanceof Error ? error.message : 'Unknown error'
      } as ApiResponse);
    }
  };
};

// Helper function to create validation preHandler
export const validateWith = (schema: ZodSchema) => zodValidation(schema);