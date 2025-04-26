const express = require("express");
const { registerAdmin, loginAdmin, getAdminProfile } = require("../controllers/authAdmin");
const { body } = require("express-validator");
const Admin = require("../models/adminSchema");
const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate"); 
require('../api-docs/api/authAdminSwagger');

const router = express.Router();

router.post(
  "/register",
  [
    body("municipalId")
      .notEmpty().withMessage("Municipal ID is required")
      .isMongoId().withMessage("Invalid Municipal ID"),
    body("firstname")
      .notEmpty().withMessage("First name is required"),
    body("lastname")
      .notEmpty().withMessage("Last name is required"),
    body("middlename")
      .optional()
      .isString().withMessage("Middle name must be a string"),
    body("email")
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Invalid email format")
      .custom(async (value) => {
        const existingAdmin = await Admin.findOne({ email: value });
        if (existingAdmin) {
          throw new Error("Email already in use");
        }
        return true;
      }),
    body("password")
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    body("picture")
      .optional()
      .isString().withMessage("Picture must be a string URL or path"),
  ],
  validate,
  registerAdmin
);

router.post(
  "/login",
  [
    body("email")
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Invalid email"),
    body("password")
      .notEmpty().withMessage("Password is required"),
  ],
  validate,
  loginAdmin
);

router.get(
  "/profile",
  authMiddleware,
  getAdminProfile
);

module.exports = router;
