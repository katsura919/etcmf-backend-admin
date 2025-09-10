import { FastifyPluginAsync } from 'fastify';
import { 
  searchDriver, 
  createDriver, 
  searchVehicle, 
  createVehicle, 
  fetchViolations, 
  createTicket 
} from '../controllers/ticketController';
import { schemas } from '../middlewares/validate';

const ticketRoutes: FastifyPluginAsync = async (fastify) => {
  // Driver routes
  fastify.get('/search-driver', {
    schema: schemas.driverSearch
  }, searchDriver);

  fastify.post('/create-driver', {
    schema: schemas.driverCreate
  }, createDriver);

  // Vehicle routes
  fastify.get('/search-vehicle', {
    schema: schemas.vehicleSearch
  }, searchVehicle);

  fastify.post('/create-vehicle', {
    schema: schemas.vehicleCreate
  }, createVehicle);

  // Violation routes for ticket creation
  fastify.get('/violations', fetchViolations);

  // Ticket creation
  fastify.post('/create-ticket', {
    schema: schemas.ticketCreate
  }, createTicket);
};

export default ticketRoutes;
