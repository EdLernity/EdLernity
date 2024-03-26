function sendSuccessResponse(responseObj, statusCode, data, msg,path) {
  const response = {
    statusCode: statusCode || 200,
    responseData: data || null,
    message: msg,
    success: true,
    redirectTo: path||null,
  };
  responseObj.status(statusCode).json(response);
}

function sendErrorResponse(responseObj, statusCode, errorMsg,path) {
  const response = {
    statusCode: statusCode || 500,
    message: errorMsg || "Something went wrong",
    success: false,
    redirectTo: path||null,
  };
  responseObj.status(statusCode).json(response);
}

module.exports = { sendSuccessResponse, sendErrorResponse };
