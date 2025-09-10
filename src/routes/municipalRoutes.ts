import { FastifyPluginAsync } from 'fastify';
import {
  createMunicipal,
  getAllMunicipals,
  getMunicipalById,
  updateMunicipal,
  deleteMunicipal
} from '../controllers/municipal';
import { authMiddleware } from '../middlewares/authMiddleware';
import { schemas } from '../middlewares/validate';

const municipalRoutes: FastifyPluginAsync = async (fastify) => {
  // Create municipal (protected)
  fastify.post('/', {
    schema: schemas.municipalCreate,
    preHandler: authMiddleware
  }, createMunicipal);

  // Get all municipals
  fastify.get('/', getAllMunicipals);

  // Get municipal by ID
  fastify.get('/:id', {
    schema: schemas.idParam
  }, getMunicipalById);

  // Update municipal (protected)
  fastify.put('/:id', {
    schema: {
      ...schemas.municipalCreate,
      ...schemas.idParam
    },
    preHandler: authMiddleware
  }, updateMunicipal);

  // Delete municipal (protected)
  fastify.delete('/:id', {
    schema: schemas.idParam,
    preHandler: authMiddleware
  }, deleteMunicipal);
};

export default municipalRoutes;
