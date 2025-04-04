const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const municipalRoutes = require('./routes/municipalRoutes');
const adminRoutes = require("./routes/adminRoutes")

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Load Swagger YAML
const swaggerDocument = YAML.load('./swagger.yaml');

// Serve Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Use municipal routes
app.use('/municipal', municipalRoutes);
app.use('/admin', adminRoutes)
mongoose.connect(process.env.MONGODB)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });
