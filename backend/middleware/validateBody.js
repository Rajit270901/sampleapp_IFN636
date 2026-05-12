// middleware for checking request body before controller runs
// https://www.w3schools.com/nodejs/nodejs_express.asp

const validateBody = (schema = {}) => { // default value used if no schema is passed https://www.w3schools.com/js/js_default_parameters.asp
  return (req, res, next) => { // returns express middleware function https://www.w3schools.com/nodejs/nodejs_express.asp
    const { required = [], types = {} } = schema; // destructuring gets required and types from schema https://www.w3schools.com/js/js_destructuring.asp

    // checking if any required fields are empty or missing
    const missing = required.filter(
      (field) => req.body[field] === undefined || req.body[field] === null || req.body[field] === "" // filter keeps fields that fail the check https://www.w3schools.com/jsref/jsref_filter.asp
    );
    if (missing.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missing.join(", ")}`, // join makes the missing fields into one string https://www.w3schools.com/jsref/jsref_join.asp
      });
    }

    // checking basic field types
    for (const [field, expectedType] of Object.entries(types)) { // Object.entries gives key value pairs https://www.w3schools.com/jsref/jsref_object_entries.asp
      if (req.body[field] !== undefined && typeof req.body[field] !== expectedType) { // typeof checks the data type https://www.w3schools.com/js/js_typeof.asp
        return res.status(400).json({
          message: `Field '${field}' must be of type ${expectedType}`,
        });
      }
    }

    next(); // validation passed so move to next middleware https://www.w3schools.com/nodejs/nodejs_express.asp
  };
};

module.exports = validateBody; // exporting so routes can use it https://www.w3schools.com/nodejs/nodejs_modules.asp