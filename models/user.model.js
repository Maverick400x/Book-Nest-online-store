import mongoose from "mongoose";

// User Schema Definition
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone:    { type: String },     // Optional
  address:  { type: String },     // Optional
  otp: {
    code:      { type: String },
    expiresAt: { type: Date }
  }
});

// Create and export the User model
export const User = mongoose.model("User", userSchema);
