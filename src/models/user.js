const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { RefreshToken } = require('./refresh_token');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
}, {
  timestamps: true
});

userSchema.methods.toJSON = function() {
  const userObject = this.toObject();

  userObject.id = userObject._id.toString();
  delete userObject._id;
  delete userObject.__v;
  delete userObject.createdAt;
  delete userObject.updatedAt;
  delete userObject.password;

  return userObject;
}

userSchema.methods.generateAccessAndRefreshTokens = async function() {
  const user = this;
  
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
  
  // Delete any old refresh token
  await RefreshToken.deleteMany({ user_id: user._id });

  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });
  await RefreshToken.create({ token: refreshToken, user_id: user._id });

  return { accessToken, refreshToken };
}

userSchema.pre('save', async function(next) {
  // Encrypt the password before saving the user model
  const user = this;
  if(user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
});

const User = mongoose.model('user', userSchema);

module.exports = { User }