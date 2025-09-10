import { FastifyPluginAsync } from 'fastify';
import {
  createPenalty,
  getAllPenalties,
  getPenaltyById,
  updatePenalty,
  deletePenalty,
  getPenaltiesByViolation
} from '../controllers/penaltyController';
import { schemas } from '../middlewares/validate';

const penaltyRoutes: FastifyPluginAsync = async (fastify) => {
  // Create penalty
  fastify.post('/create', {
    schema: schemas.penaltyCreate
  }, createPenalty);

  // Get all penalties
  fastify.get('/', getAllPenalties);

  // Get penalty by ID
  fastify.get('/:id', {
    schema: schemas.idParam
  }, getPenaltyById);

  // Update penalty
  fastify.put('/:id', {
    schema: {
      ...schemas.penaltyCreate,
      ...schemas.idParam
    }
  }, updatePenalty);

  // Delete penalty
  fastify.delete('/:id', {
    schema: schemas.idParam
  }, deletePenalty);

  // Get penalties by violation
  fastify.get('/violation/:violationId', {
    schema: {
      params: {
        type: 'object',
        properties: {
          violationId: { type: 'string' }
        },
        required: ['violationId']
      }
    }
  }, getPenaltiesByViolation);
};

export default penaltyRoutes;
