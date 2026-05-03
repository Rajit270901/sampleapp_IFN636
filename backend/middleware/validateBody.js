// middleware/validateBody.js
//
// Middleware Pattern + Higher-Order Function:
// Returns a middleware function configured with a validation schema.
// This is a FACTORY of middleware — call validateBody({...}) to get
// a configured middleware that fits into the Express chain.
//
// Mirrors Tutorial 7's ValidationMiddleware: checks the request data
// before passing to the next link. If validation fails, the chain
// stops here and returns 400; the controller is never called.
//
// Example usage:
//   router.post(
//     "/",
//     protect,
//     validateBody({ required: ["doctor", "slot"] }),
//     bookAppointment
//   );

const validateBody = (schema = {}) => {
  return (req, res, next) => {
    const { required = [], types = {} } = schema;

    // Check required fields
    const missing = required.filter(
      (field) => req.body[field] === undefined || req.body[field] === null || req.body[field] === ""
    );
    if (missing.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missing.join(", ")}`,
      });
    }

    // Check field types (basic check, not exhaustive)
    for (const [field, expectedType] of Object.entries(types)) {
      if (req.body[field] !== undefined && typeof req.body[field] !== expectedType) {
        return res.status(400).json({
          message: `Field '${field}' must be of type ${expectedType}`,
        });
      }
    }

    next(); // validation passed — proceed down the chain
  };
};

module.exports = validateBody;