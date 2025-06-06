// api-docs/swaggerDefinition.js

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "Admin API",
      version: "1.0.0",
      description: "API for managing admins and officers",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local server",
      },
      {
        url: "https://your-deployed-url.com",
        description: "Deployed server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Admin: {
            type: "object",
            properties: {
              firstname: { type: "string", example: "John" },
              lastname: { type: "string", example: "Doe" },
              middlename: { type: "string", example: "Smith" },
              email: { type: "string", example: "admin@example.com" },
              password: { type: "string", example: "password123" },
              picture: { type: "string", example: "https://example.com/profile.jpg", description: "Profile picture URL (optional)" }
            },
            required: ["firstname", "lastname", "email", "password"],
          },
        Officer: {
          type: "object",
          properties: {
            role: { type: "string", example: "Police Officer" },
            firstName: { type: "string", example: "Jane" },
            lastName: { type: "string", example: "Smith" },
            middleName: { type: "string", example: "Ann" },
            address: { type: "string", example: "456 Elm Street, City" },
            contactNo: { type: "string", example: "09123456789" },
            email: { type: "string", example: "officer@example.com" },
            picture: { type: "string", example: "https://example.com/photo.jpg" },
            password: { type: "string", example: "officerpass" },
          },
          required: [
            "role",
            "firstName",
            "lastName",
            "address",
            "contactNo",
            "email",
            "password",
          ],
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  };
  
  module.exports = swaggerDefinition;
