import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a project title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: [150, 'Short description cannot be more than 150 characters']
  },
  images: [{
    type: String
  }],
  technologies: [{
    type: String,
    required: true
  }],
  liveUrl: {
    type: String
  },
  githubUrl: {
    type: String
  },
  category: {
    type: String,
    required: true,
    enum: ['web', 'mobile', '3d', 'design', 'other']
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'planned'],
    default: 'completed'
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.model('Project', projectSchema);