
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import adminRoutes from './routes/admin.js';
import blogRoutes from './routes/blogs.js';
import projectRoutes from './routes/projects.js';
import courseRoutes from './routes/courses.js';
import contactRoutes from './routes/contact.js';
import authRoutes from './routes/auth.js';


// Load env vars
dotenv.config();

const app = express();

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security Middleware
app.use(helmet());
/*app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  //credentials: true
}));
*/
// With this:
app.use(cors({
  origin: [
    'https://nikhilhadbe.netlify.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: false
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
});
app.use(limiter);

// Body Parsing Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Debug route loading - ADD THIS RIGHT HERE
console.log('🔍 Loading routes...');
console.log('Auth routes type:', typeof authRoutes);
console.log('Project routes type:', typeof projectRoutes);
console.log('Blog routes type:', typeof blogRoutes);



//contact routes
app.use('/api/contact', contactRoutes);

// Routes
app.use('/api/auth', authRoutes);

// Admin Routes
app.use('/api/admin', adminRoutes);

// blog routes
app.use('/api/blogs', blogRoutes);

//project routes
app.use('/api/projects', projectRoutes);

//courses routes
app.use('/api/courses', courseRoutes);



// Routes (We'll create these next)
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Test API Route
app.get('/api/test-connection', async (req, res) => {
  try {
    // Test database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    res.json({
      message: 'Full stack test successful!',
      database: dbStatus,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message 
  });
});

// 404 Handler - FIXED: Remove the path entirely for 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});