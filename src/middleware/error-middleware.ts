import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ResponseError } from "../error/response-error";

export function errorMiddleware(error : Error, request : Request, response : Response, next : NextFunction) : void {
     // Handle if error is ZodError
     if (error instanceof ZodError) {
          const handleIssueZod = error.issues.map(issue => (
               { path: issue.path.join("."), message: issue.message }
          ));

          response.status(400).json({ success: false, message: "Validation failed. Please check your input.", errors: handleIssueZod, data: {} });
     }

     // Handle if error is ResponseError
     if (error instanceof ResponseError) {
          response.status(error.status).json({ success: false, message: error.message, data: {} });
     }

     response.status(500).json({ errors: "Internal server erorrs"});
}