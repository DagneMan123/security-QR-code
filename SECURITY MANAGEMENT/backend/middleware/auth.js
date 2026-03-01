import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.token;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
      });
    }

    // Extract token
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Attach user info to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again."
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Admin role verification middleware
export const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required."
    });
  }
  next();
};

// Security officer role verification middleware
export const verifySecurity = (req, res, next) => {
  if (req.user.role !== 'security_officer') {
    return res.status(403).json({
      success: false,
      message: "Access denied. Security officer role required."
    });
  }
  next();
};

// Student role verification middleware
export const verifyStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({
      success: false,
      message: "Access denied. Student role required."
    });
  }
  next();
};