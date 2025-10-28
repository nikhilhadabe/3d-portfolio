import express from 'express';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
import Blog from '../models/Blog.js';

const router = express.Router();

// @desc    Get all blogs with pagination and filtering
// @route   GET /api/blogs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;

    let query = { isPublished: true };

    // Filter by category
    if (category && category !== 'all') {
      query.categories = category;
    }

    // Search in title and content
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBlogs = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / limit);

    // Get unique categories for filter
    const categories = await Blog.distinct('categories', { isPublished: true });

    res.json({
      success: true,
      data: {
        blogs,
        pagination: {
          current: page,
          total: totalPages,
          count: blogs.length,
          totalBlogs
        },
        categories
      }
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs'
    });
  }
});

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate('author', 'name avatar email');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog'
    });
  }
});
/*
// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const blog = await Blog.create({
      ...req.body,
      author: req.user.id
    });

    await blog.populate('author', 'name avatar');

    res.status(201).json({
      success: true,
      data: blog,
      message: 'Blog created successfully'
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating blog'
    });
  }
});*/
// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    console.log('=== BLOG CREATION ATTEMPT ===');
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
    console.log('User ID:', req.user.id);
    console.log('User Role:', req.user.role);
    
    const blog = await Blog.create({
      ...req.body,
      author: req.user.id
    });

    console.log('✅ Blog created successfully:', blog._id);
    await blog.populate('author', 'name avatar');

    res.status(201).json({
      success: true,
      data: blog,
      message: 'Blog created successfully'
    });
  } catch (error) {
    console.error('❌ CREATE BLOG ERROR DETAILS:');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      console.error('Validation Errors:', errors);
      return res.status(400).json({
        success: false,
        message: 'Validation Error: ' + errors.join(', ')
      });
    }
    
    if (error.code === 11000) {
      console.error('Duplicate key error');
      return res.status(400).json({
        success: false,
        message: 'Blog with this title/slug already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating blog: ' + error.message
    });
  }
});

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name avatar');

    res.json({
      success: true,
      data: blog,
      message: 'Blog updated successfully'
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating blog'
    });
  }
});

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting blog'
    });
  }
});

export default router;