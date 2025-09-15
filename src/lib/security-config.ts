// Security Configuration for ZIVAH International
export const securityConfig = {
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // requests per window
    sensitiveEndpoints: {
      limit: 5, // requests per window for sensitive endpoints
      windowMs: 60 * 60 * 1000, // 1 hour
    },
  },

  // Form submission limits
  formLimits: {
    maxSubmissions: 5, // submissions per window
    windowMs: 60 * 1000, // 1 minute
    cooldownMs: 30 * 1000, // 30 seconds between submissions
  },

  // File upload limits
  fileUpload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },

  // Input validation
  inputValidation: {
    maxLengths: {
      name: 100,
      email: 254,
      phone: 20,
      company: 100,
      message: 2000,
      subject: 200,
      address: 500,
    },
    patterns: {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^[\+]?[1-9][\d]{0,15}$/,
      name: /^[a-zA-Z\s\-']{2,}$/,
    },
  },

  // CORS configuration
  cors: {
    allowedOrigins: [
      'https://zivahinternational.com',
      'https://www.zivahinternational.com',
      'http://localhost:3000', // Development
      'http://127.0.0.1:3000', // Development
    ],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400, // 24 hours
  },

  // Security headers
  headers: {
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    csp: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com',
      ],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      connectSrc: [
        "'self'",
        'https://www.google-analytics.com',
        'https://www.googletagmanager.com',
      ],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: true,
    },
  },

  // Blocked IPs (add known malicious IPs)
  blockedIPs: new Set<string>([
    // Add known malicious IPs here
    // '192.168.1.1',
  ]),

  // Blocked user agents
  blockedUserAgents: [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /sqlmap/i,
    /nmap/i,
    /masscan/i,
    /dirbuster/i,
    /gobuster/i,
    /nikto/i,
    /acunetix/i,
    /openvas/i,
    /nessus/i,
    /qualys/i,
    /rapid7/i,
    /metasploit/i,
  ],

  // Suspicious patterns to block
  suspiciousPatterns: [
    /\.\./, // Directory traversal
    /<script/i, // XSS attempts
    /javascript:/i, // JavaScript injection
    /on\w+\s*=/i, // Event handler injection
    /eval\(/i, // Code execution
    /base64,/i, // Base64 encoded content
    /data:text/i, // Data URL injection
  ],

  // API keys (for internal API access)
  apiKeys: [
    // Add valid API keys here
    // 'your-api-key-1',
    // 'your-api-key-2',
  ],

  // Logging configuration
  logging: {
    securityEvents: true,
    apiAccess: true,
    rateLimitViolations: true,
    suspiciousActivity: true,
  },
};

// Environment-specific overrides
if (process.env.NODE_ENV === 'development') {
  // Relax some restrictions for development
  securityConfig.cors.allowedOrigins.push('http://localhost:3000');
  securityConfig.headers.csp.upgradeInsecureRequests = false;
  securityConfig.headers.hsts.maxAge = 0;
}

if (process.env.NODE_ENV === 'test') {
  // Minimal security for testing
  securityConfig.rateLimit.maxRequests = 1000;
  securityConfig.formLimits.maxSubmissions = 100;
}

export default securityConfig;
