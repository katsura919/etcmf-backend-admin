// api-docs/api/authOfficerSwagger.js

/**
 * @swagger
 * tags:
 *   - name: Officer
 *     description: API for officer authentication
 */

/**
 * @swagger
 * /auth/officer/login:
 *   post:
 *     tags: [Officer]
 *     summary: Officer login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "officer@example.com"
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
 *                 officer:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "608d1b2f2f8fb814b56fa181"
 *                     municipal:
 *                       type: string
 *                       description: "The ObjectId of the Municipal model"
 *                       example: "60c72b2f9e7c6c1f1a2b2d8e"
 *                     role:
 *                       type: string
 *                       example: "Officer"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     middleName:
 *                       type: string
 *                       example: "Alexander"
 *                     address:
 *                       type: string
 *                       example: "123 Main St"
 *                     contactNo:
 *                       type: string
 *                       example: "+123456789"
 *                     email:
 *                       type: string
 *                       example: "officer@example.com"
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
 * /auth/officer/register:
 *   post:
 *     tags: [Officer]
 *     summary: Register a new officer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               municipal:
 *                 type: string
 *                 description: "The ObjectId of the Municipal model"
 *                 example: "60c72b2f9e7c6c1f1a2b2d8e"
 *               role:
 *                 type: string
 *                 example: "Officer"
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               middleName:
 *                 type: string
 *                 example: "Alexander"
 *               address:
 *                 type: string
 *                 example: "123 Main St"
 *               contactNo:
 *                 type: string
 *                 example: "+123456789"
 *               email:
 *                 type: string
 *                 example: "officer@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               picture:
 *                 type: string
 *                 example: "https://example.com/profile.jpg"
 *             required:
 *               - municipal
 *               - role
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Officer successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Officer registered successfully"
 *       400:
 *         description: Officer already exists
 *       500:
 *         description: Server error
 */
