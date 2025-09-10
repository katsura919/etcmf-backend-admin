import { FastifyPluginAsync } from 'fastify';
import {
  createViolation,
  getAllViolations,
  getViolationById,
  updateViolation,
  deleteViolation,
  searchViolation
} from '../controllers/violationController';
import { schemas } from '../middlewares/validate';

const violationRoutes: FastifyPluginAsync = async (fastify) => {
  // Create violation
  fastify.post('/create', {
    schema: schemas.violationCreate
  }, createViolation);

  // Search violations
  fastify.get('/search', {
    schema: schemas.violationSearch
  }, searchViolation);

  // Get all violations
  fastify.get('/', getAllViolations);

  // Get violation by ID
  fastify.get('/:id', {
    schema: schemas.idParam
  }, getViolationById);

  // Update violation
  fastify.put('/:id', {
    schema: {
      ...schemas.violationCreate,
      ...schemas.idParam
    }
  }, updateViolation);

  // Delete violation
  fastify.delete('/:id', {
    schema: schemas.idParam
  }, deleteViolation);
};

export default violationRoutes;
