const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./api-docs/swagger');  

const connectDB = require('./libs/db'); 
const municipalRoutes = require('./routes/municipalRoutes');
const authAdminRoutes = require("./routes/authAdminRoutes");
const authOfficerRoutes = require("./routes/officerRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Load Swagger JS
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API routes
app.use('/municipal', municipalRoutes);
app.use('/auth/admin', authAdminRoutes);
app.use('/auth/officer', authOfficerRoutes);
app.use('/admin', adminRoutes);

// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
