// middleware/requestLogger.js
//
// Middleware Pattern (Chain of Responsibility):
// One link in the request-processing chain. Mirrors Tutorial 7's
// LoggingMiddleware example: each middleware performs ONE task,
// then passes control to the next via next().
//
// In Express, the chain is:
//   requestLogger → protect → adminOnly → validateBody → controller
//
// Each piece is independent and reorderable, demonstrating the
// pattern's hallmark: separation of concerns, reusability, scalability.

const requestLogger = (req, res, next) => {
  const ts = new Date().toISOString();
  const userInfo = req.user ? `user=${req.user.id}` : "user=anonymous";
  console.log(
    `[${ts}] ${req.method} ${req.originalUrl} ${userInfo} ip=${req.ip}`
  );
  next(); // pass control to the next middleware in the chain
};

module.exports = requestLogger;