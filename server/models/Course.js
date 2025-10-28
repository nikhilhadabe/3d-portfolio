import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  thumbnail: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  duration: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  instructor: {
    type: String,
    required: true,
    default: 'Your Name'
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  studentsEnrolled: {
    type: Number,
    default: 0
  },
  lessons: [{
    title: String,
    duration: String,
    videoUrl: String,
    description: String
  }],
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Course', courseSchema);