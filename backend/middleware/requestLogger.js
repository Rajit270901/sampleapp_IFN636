// middleware used to log each request before it goes to the next part
// https://www.w3schools.com/nodejs/nodejs_express.asp

const requestLogger = (req, res, next) => { // arrow function used for express middleware https://www.w3schools.com/js/js_arrow_function.asp
  const ts = new Date().toISOString(); // gets current date and converts it into readable iso format https://www.w3schools.com/js/js_dates.asp
  const userInfo = req.user ? `user=${req.user.id}` : "user=anonymous"; // if user exists show id otherwise anonymous https://www.w3schools.com/js/js_comparisons.asp
  console.log(
    `[${ts}] ${req.method} ${req.originalUrl} ${userInfo} ip=${req.ip}` // template string makes the log message easier to build https://www.w3schools.com/js/js_string_templates.asp
  );
  next(); // sends the request to the next middleware https://www.w3schools.com/nodejs/nodejs_express.asp
};

module.exports = requestLogger; // exporting so server/routes can use it https://www.w3schools.com/nodejs/nodejs_modules.asp