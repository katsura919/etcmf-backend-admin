import { FastifyPluginAsync } from 'fastify';
import { registerAdmin, loginAdmin } from '../controllers/authAdmin';
import { schemas } from '../middlewares/validate';

const authAdminRoutes: FastifyPluginAsync = async (fastify) => {
  // Admin registration route
  fastify.post('/register', {
    schema: schemas.adminRegister
  }, registerAdmin);

  // Admin login route
  fastify.post('/login', {
    schema: schemas.adminLogin
  }, loginAdmin);
};

export default authAdminRoutes;
