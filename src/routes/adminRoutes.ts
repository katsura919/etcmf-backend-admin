import { FastifyPluginAsync } from 'fastify';
import { getAdminData, updateAdminData, changeProfilePicture } from '../controllers/admin';
import { authMiddleware } from '../middlewares/authMiddleware';
import { schemas } from '../middlewares/validate';

const adminRoutes: FastifyPluginAsync = async (fastify) => {
  // Register multipart for file uploads
  await fastify.register(require('@fastify/multipart'));

  // Get admin profile (protected)
  fastify.get('/me', {
    preHandler: authMiddleware
  }, getAdminData);

  // Update admin profile (protected)
  fastify.put('/:id', {
    schema: {
      ...schemas.adminUpdate,
      ...schemas.idParam
    }
  }, updateAdminData);

  // Update profile picture (protected)
  fastify.put('/:id/profile-picture', {
    schema: schemas.idParam,
    preHandler: authMiddleware
  }, changeProfilePicture);
};

export default adminRoutes;
