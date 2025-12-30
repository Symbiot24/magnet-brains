const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  dueDate: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

// Transform output to match frontend format
taskSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.id = obj._id;
  obj.createdAt = obj.createdAt.toISOString();
  obj.updatedAt = obj.updatedAt.toISOString();
  return obj;
};

module.exports = mongoose.model('Task', taskSchema);
