// api-docs/api/authAdminSwagger.js

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: API for admin authentication
 */

/**
 * @swagger
 * /auth/admin/login:
 *   post:
 *     tags: [Admin]
 *     summary: Admin login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 admin:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "608d1b2f2f8fb814b56fa181"
 *                     firstname:
 *                       type: string
 *                       example: "John"
 *                     email:
 *                       type: string
 *                       example: "admin@example.com"
 *                     picture:
 *                       type: string
 *                       example: "https://example.com/profile.jpg"
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /auth/admin/register:
 *   post:
 *     tags: [Admin]
 *     summary: Register a new admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               municipalId:
 *                 type: string
 *                 example: "67efd30eaebffaf726804bad"
 *               firstname:
 *                 type: string
 *                 example: "John"
 *               lastname:
 *                 type: string
 *                 example: "Doe"
 *               middlename:
 *                 type: string
 *                 example: "Alexander"
 *               email:
 *                 type: string
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               picture:
 *                 type: string
 *                 example: "https://example.com/profile.jpg"
 *             required:
 *               - municipalId
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Admin successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin registered successfully"
 *       400:
 *         description: Admin already exists
 *       500:
 *         description: Server error
 */
