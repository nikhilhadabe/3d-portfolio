import User from '../models/User.js';

export const admin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user && user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in admin verification'
    });
  }
};