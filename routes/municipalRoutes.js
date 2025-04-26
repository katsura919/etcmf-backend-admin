const express = require('express');
const {
  createMunicipal,
  getAllMunicipals,
  getMunicipalById,
  updateMunicipal,
  deleteMunicipal,
} = require('../controllers/municipal');
const authMiddleware = require('../middlewares/authMiddleware');
const { body, param } = require('express-validator'); 
const validate = require('../middlewares/validate');

const router = express.Router();


router.post(
  '/',
  authMiddleware,
  [
    body('name')
      .notEmpty().withMessage('Municipal name is required')
      .isLength({ min: 3 }).withMessage('Municipal name should be at least 3 characters'),
    body('address')
      .notEmpty().withMessage('Address is required'),
  ],
  validate,
  createMunicipal
);


router.get('/', 
  authMiddleware, 
  getAllMunicipals
);


router.get(
  '/:id',
  authMiddleware,
  [
    param('id').isMongoId().withMessage('Invalid Municipal ID'), 
  ],
  validate,
  getMunicipalById
);


router.put(
  '/:id',
  authMiddleware,
  [
    param('id').isMongoId().withMessage('Invalid Municipal ID'), 
    body('name')
      .optional()
      .isLength({ min: 3 }).withMessage('Municipal name should be at least 3 characters'),
    body('address').optional().notEmpty().withMessage('Address cannot be empty'),
  ],
  validate,
  updateMunicipal
);


router.delete(
  '/:id',
  authMiddleware,
  [
    param('id').isMongoId().withMessage('Invalid Municipal ID'), 
  ],
  validate,
  deleteMunicipal
);

module.exports = router;
