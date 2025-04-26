// api-docs/swaggerDefinition.js

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "Admin API",
      version: "1.0.0",
      description: "API for managing municipals, admins, and officers",
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
        Municipal: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Sample Municipal",
            },
            address: {
              type: "string",
              example: "123 Main Street, City",
            },
          },
          required: ["name", "address"],
        },
        Admin: {
            type: "object",
            properties: {
              municipalId: {
                type: "string",
                example: "60d0fe4f5311236168a109ca",
                description: "Reference ID of the Municipal",
              },
              firstname: { type: "string", example: "John" },
              lastname: { type: "string", example: "Doe" },
              middlename: { type: "string", example: "Smith" },
              email: { type: "string", example: "admin@example.com" },
              password: { type: "string", example: "password123" },
              picture: { type: "string", example: "https://example.com/profile.jpg", description: "Profile picture URL (optional)" }
            },
            required: ["municipalId", "firstname", "lastname", "email", "password"],
          },
        Officer: {
          type: "object",
          properties: {
            municipal: {
              type: "string",
              example: "60d0fe4f5311236168a109ca",
              description: "Reference ID of the Municipal",
            },
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
            "municipal",
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
  