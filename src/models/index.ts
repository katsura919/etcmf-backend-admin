// Export all models and their interfaces
// Unified User model (replaces Admin, Driver, Officer)
export { User, IUser, UserRole } from './userModel';

// Other models
export { Vehicle, IVehicle } from './vehicleSchema';
export { Owner, IOwner } from './ownerSchema';
export { Violation, IViolation } from './violationSchema';
export { Penalty, IPenalty } from './penaltySchema';
export { Ticket, ITicket, TicketStatus } from './ticketSchema';
export { TrafficViolation, ITrafficViolation } from './trafficViolation';
export { Municipal, IMunicipal } from './municipalSchema';

// Legacy exports (deprecated - use User model instead)
// TODO: Remove these after migration is complete
export { Admin, IAdmin } from './adminSchema';
export { Driver, IDriver } from './driverSchema';
export { Officer, IOfficer } from './officerSchema';
