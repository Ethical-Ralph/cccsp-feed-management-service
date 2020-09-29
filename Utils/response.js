exports.success = (res, status, data) => {
  if (typeof status != "number" && (typeof status === "object" || "string")) {
    data = status;
    status = 200;
  }
  res.status(status).json({
    success: true,
    data,
  });
};

exports.error = (res, status, error) => {
  let { name, message } = Error(error);
  return res.status(status).json({
    success: false,
    error: {
      name,
      message,
    },
  });
};
