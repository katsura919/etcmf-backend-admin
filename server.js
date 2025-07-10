const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./api-docs/swagger');  

const connectDB = require('./libs/db'); 
const authAdminRoutes = require("./routes/authAdminRoutes");
const authOfficerRoutes = require("./routes/officerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const ticketRoutes = require('./routes/ticketRoutes');
// Imported violation and penalty routes
const violationRoutes = require('./routes/violationRoutes');
const penaltyRoutes = require('./routes/penaltyRoutes');

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

// Configure CORS to allow requests from the frontend
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true // This allows cookies/auth headers to be sent
}));
app.use(express.json());

// Load Swagger JS
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API routes
app.use('/auth/admin', authAdminRoutes);
app.use('/auth/officer', authOfficerRoutes);
app.use('/admin', adminRoutes);
app.use('/ticket', ticketRoutes);
app.use('/violations', violationRoutes);
app.use('/penalties', penaltyRoutes);

// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
