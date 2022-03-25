const { ValidationError }  = require('express-validation');

module.exports = (error, req, res, next) => {
  if (error instanceof ValidationError) {
    return res.status(error.statusCode).json(error)
  }
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  const validation = error.validation;
  res.status(status).json({
    message,
    data,
    validation
  });
};
