"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const zod_1 = require("zod");
const response_error_1 = require("../error/response-error");
function errorMiddleware(error, request, response, next) {
    // Handle if error is ZodError
    if (error instanceof zod_1.ZodError) {
        const handleIssueZod = error.issues.map(issue => ({ path: issue.path.join("."), message: issue.message }));
        response.status(400).json({ success: false, message: "Validation failed. Please check your input.", errors: handleIssueZod, data: {} });
    }
    // Handle if error is ResponseError
    if (error instanceof response_error_1.ResponseError) {
        response.status(error.status).json({ success: false, message: error.message, data: {} });
    }
    response.status(500).json({ errors: "Internal server erorrs" });
}
exports.errorMiddleware = errorMiddleware;
