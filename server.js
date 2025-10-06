#!/usr/bin/env node

/**
 * cPanel Compatible Server for ZIVAH International Next.js App
 * This file acts as the entry point for cPanel Node.js hosting
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Configuration
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      // Parse request URL
      const parsedUrl = parse(req.url, true);

      // Handle the request
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  // Start the server
  server.listen(port, err => {
    if (err) throw err;
    // eslint-disable-next-line no-console
    console.log(`> Ready on http://${hostname}:${port}`);
    // eslint-disable-next-line no-console
    console.log(`> Environment: ${process.env.NODE_ENV}`);
    // eslint-disable-next-line no-console
    console.log(`> Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    // eslint-disable-next-line no-console
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      // eslint-disable-next-line no-console
      console.log('Process terminated');
    });
  });

  process.on('SIGINT', () => {
    // eslint-disable-next-line no-console
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
      // eslint-disable-next-line no-console
      console.log('Process terminated');
    });
  });
});
