import { FastifyPluginAsync } from 'fastify';
import { registerOfficer, loginOfficer } from '../controllers/authOfficer';
import { schemas } from '../middlewares/validate';

const authOfficerRoutes: FastifyPluginAsync = async (fastify) => {
  // Officer registration route
  fastify.post('/register', {
    schema: schemas.officerRegister
  }, registerOfficer);

  // Officer login route
  fastify.post('/login', {
    schema: schemas.adminLogin // Same schema as admin login
  }, loginOfficer);
};

export default authOfficerRoutes;
