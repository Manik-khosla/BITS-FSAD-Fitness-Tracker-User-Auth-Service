const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
}, {
  timestamps: true
});

refreshTokenSchema.methods.toJSON = function() {
  const refreshTokenObject = this.toObject();

  refreshTokenObject.id = refreshTokenObject._id.toString();
  delete refreshTokenObject._id;
  delete refreshTokenObject.__v;
  delete refreshTokenObject.createdAt;
  delete refreshTokenObject.updatedAt;

  return refreshTokenObject;
};

const RefreshToken = mongoose.model('refresh_token', refreshTokenSchema);

module.exports = { RefreshToken }