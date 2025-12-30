const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, { timestamps: true });

// Each user can only have one team list
teamSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model('Team', teamSchema);
