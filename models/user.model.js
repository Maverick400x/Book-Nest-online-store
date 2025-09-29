import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required."],
    trim: true,
    minlength: [3, "Full name must be at least 3 characters long."]
  },

  username: {
    type: String,
    required: [true, "Username is required."],
    unique: true,
    trim: true,
    minlength: [3, "Username must be at least 3 characters long."]
  },

  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(v);
      },
      message: "Enter a valid email address."
    }
  },

  phone: {
    type: String,
    required: false, // ✅ Make optional
    trim: true,
    validate: {
      validator: function (v) {
        return !v || /^\d{10}$/.test(v); // Allow blank or valid 10-digit
      },
      message: "Enter a valid 10-digit phone number."
    }
  },

  address: {
    type: String,
    required: false, // ✅ Make optional
    trim: true,
    maxlength: [200, "Address cannot exceed 200 characters."]
  },

  password: {
    type: String,
    required: false, // ✅ Make optional for OTP flow
    trim: true
  },

  otp: {
    type: String
  },

  otpExpiry: {
    type: Date
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const User = mongoose.model("User", userSchema);