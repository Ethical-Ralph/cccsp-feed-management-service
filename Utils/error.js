const isProd = process.env.NODE_ENV === "production";

// Error Handler

const errorHandler = (app) => {
  app.use((req, res, next) => {
    const error = new Error();
    error.name = "Not Found";
    error.status = 404;
    next(error);
  });

  app.use((err, req, res, next) => {
    const statusCode = err.status ? err.status : 404;
    const error = isProd
      ? {
          status: statusCode,
          error: {
            name: err.name,
            message: err.message,
          },
        }
      : {
          status: statusCode,
          error: {
            name: err.name,
            message: err.message,
            stack: err.stack,
          },
        };
    return res.status(statusCode).json(error);
  });

  return app;
};

// Error Responses

const authenticationError = (message) => {
  const err = new Error();
  err.name = "Authentication Error";
  err.status = 401;
  err.message = message;
  throw err;
};

const requestError = (message) => {
  const err = new Error();
  err.name = "Bad Request";
  err.status = 400;
  err.message = message;
  throw err;
};

const notFoundError = (message) => {
  const err = new Error();
  err.name = "Not Found";
  err.status = 404;
  err.message = message;
  return err;
};

const catchError = (error, next) => {
  switch (error.name) {
    case "CastError":
      error = "Sorry this ID is invalid";
      return next(error);

    default:
      return next(error);
  }
};

module.exports = {
  errorHandler,
  authenticationError,
  requestError,
  catchError,
  notFoundError,
};
