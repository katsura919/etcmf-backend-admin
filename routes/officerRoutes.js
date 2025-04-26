const express = require("express");
const { registerOfficer, loginOfficer } = require("../controllers/authOfficer");
const { body } = require("express-validator");
const Officer = require("../models/officerSchema");
const validate = require("../middlewares/validate"); 
require('../api-docs/api/authOfficerSwagger');

const router = express.Router();


router.post(
  "/register",
  [
    body("municipal").notEmpty().withMessage("Municipal ID is required").isMongoId().withMessage("Invalid Municipal ID"),
    body("role").notEmpty().withMessage("Role is required"),
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("middleName").notEmpty().withMessage("Middle name is required"),
    body("address").notEmpty().withMessage("Address is required"),
    body("contactNo").notEmpty().withMessage("Contact number is required"),
    body("email")
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Invalid email")
      .custom(async (value) => {
        const existingOfficer = await Officer.findOne({ email: value });
        if (existingOfficer) {
          throw new Error("Email already in use");
        }
        return true;
      }),
    body("password")
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
  ],
  validate, 
  registerOfficer
);


router.post(
  "/login",
  [
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required")
  ],
  validate, 
  loginOfficer
);

module.exports = router;
