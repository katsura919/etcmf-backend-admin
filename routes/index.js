const express = require('express');

const adminRoutes = require('./adminRoutes');
const authAdminRoutes = require('./authAdminRoutes');
const municipalRoutes = require('./municipalRoutes');
const authOfficerRoutes = require('./officerRoutes');
const penaltyRoutes = require('./penaltyRoutes');
const ticketRoutes = require('./ticketRoutes');
const violationRoutes = require('./violationRoutes');


const api = express.Router();

api.use('/auth/admin', authAdminRoutes);
api.use('/auth/officer', authOfficerRoutes);
api.use('/admin', adminRoutes);
api.use('/ticket', ticketRoutes);
api.use('/violations', violationRoutes);
api.use('/penalties', penaltyRoutes);
api.use('/municipals', municipalRoutes);


module.exports = api;