const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: [3, 'Username must be at least 3 characters long'],
    required: [true, 'Username is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'Email must be unique'],
    lowercase: true,
    validate: [validator.isEmail, 'Invalid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [6, 'Password must be at least 6 characters long'],
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin'],
  },
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
