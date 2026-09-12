// Vercel serverless entry — re-exports the Express app.
// Routes: /api/* -> server.js (see vercel.json).
const app = require('../server/server');

module.exports = app;
