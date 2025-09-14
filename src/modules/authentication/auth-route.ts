import { FastifyPluginAsync } from 'fastify';
import { 
  registerUser, 
  loginUser, 
  registerAdmin, 
  registerOfficer, 
  registerDriver,
  getUserProfile 
} from './auth-controller';
import { authSchemas } from './auth-schemas';
import { validateWith } from './zod-validation';

const authRoutes: FastifyPluginAsync = async (fastify) => {
  // Universal routes
  fastify.post('/register', {
    preHandler: validateWith(authSchemas.userRegister)
  }, registerUser);

  fastify.post('/login', {
    preHandler: validateWith(authSchemas.login)
  }, loginUser);

  // Protected route to get user profile
  fastify.get('/profile', {
    preHandler: validateWith(authSchemas.profile)
  }, getUserProfile);

  // Role-specific registration routes (convenience endpoints)
  fastify.post('/register/admin', {
    preHandler: validateWith(authSchemas.adminRegister)
  }, registerAdmin);

  fastify.post('/register/officer', {
    preHandler: validateWith(authSchemas.officerRegister)
  }, registerOfficer);

  fastify.post('/register/driver', {
    preHandler: validateWith(authSchemas.driverRegister)
  }, registerDriver);

  // Legacy compatibility routes (optional - for gradual migration)
  fastify.post('/admin/register', {
    preHandler: validateWith(authSchemas.adminRegister)
  }, registerAdmin);

  fastify.post('/admin/login', {
    preHandler: validateWith(authSchemas.login)
  }, loginUser);

  fastify.post('/officer/register', {
    preHandler: validateWith(authSchemas.officerRegister)
  }, registerOfficer);

  fastify.post('/officer/login', {
    preHandler: validateWith(authSchemas.login)
  }, loginUser);

  fastify.post('/driver/register', {
    preHandler: validateWith(authSchemas.driverRegister)
  }, registerDriver);

  fastify.post('/driver/login', {
    preHandler: validateWith(authSchemas.login)
  }, loginUser);
};

export default authRoutes;