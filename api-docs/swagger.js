// api-docs/swagger.js

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerDefinition = require("./swaggerDefinition");

const swaggerOptions = {
  swaggerDefinition,
  apis: [
    "../routes/authAdminRoutes.js", "./api-docs/api/authAdminSwagger.js", 
    "../routes/authOfficerRoutes.js", "./api-docs/api/authOfficerSwagger.js"
  ]
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = swaggerDocs;
