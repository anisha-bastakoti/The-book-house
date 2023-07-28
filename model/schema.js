const mongoose = require('mongoose');
require('dotenv').config();
const jwt = require('jsonwebtoken');

// Define the schema
const RegisterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add the full name"],
  },
  email: {
    type: String,
    required: [true, "Please add the email"],
    unique: [true, "Email already exists"],
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  is_verified: {
    type: String,
  },
  otp: {
    type: String,
    required: true,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

// Create the model and export it
const Register = mongoose.model("LOGreg", RegisterSchema);
module.exports = Register;
