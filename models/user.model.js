import mongoose from "mongoose";

// Define User Schema
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required."],
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  username: {
    type: String,
    required: [true, "Username is required."],
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
    match: [/^[a-zA-Z][a-zA-Z0-9_]{2,19}$/, "Invalid username format."]
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Only Gmail addresses are allowed."]
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    minlength: 6
  },
  phone: {
    type: String,
    match: [/^\d{10}$/, "Phone number must be 10 digits."],
    default: ""
  },
  address: {
    type: String,
    maxlength: 250,
    default: ""
  },
  resetToken: {
    type: String
  },
  resetTokenExpiry: {
    type: Date
  }
}, {
  timestamps: true // adds createdAt and updatedAt fields
});

// Export the User model
export const User = mongoose.model("User", userSchema);