export const rateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  // Each rateLimiter instance maintains its own separate map
  const requestCounts = new Map();

  return (req, res, next) => {
    const ip = req.ip || req.socket?.remoteAddress || req.connection?.remoteAddress || '127.0.0.1';
    
    // In local development, bypass rate limiting to prevent developer lockouts
    const isLocal = ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1' || process.env.NODE_ENV !== 'production';
    if (isLocal) {
      return next();
    }

    const now = Date.now();
    
    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, []);
    }

    const requests = requestCounts.get(ip);
    
    // Remove old requests outside the window
    const recentRequests = requests.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      });
    }

    recentRequests.push(now);
    requestCounts.set(ip, recentRequests);
    
    next();
  };
};

export const loginRateLimiter = rateLimiter(50, 15 * 60 * 1000); // 50 attempts per 15 minutes
export const apiRateLimiter = rateLimiter(1000, 15 * 60 * 1000); // 1000 requests per 15 minutes
