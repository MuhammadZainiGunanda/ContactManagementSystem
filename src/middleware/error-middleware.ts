import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ResponseError } from "../error/response-error";

export function errorMiddleware(error : Error, request : Request, response : Response, next : NextFunction) : void {
     // Handle if error is ZodError
     if (error instanceof ZodError) {
          const handleIssueZod = error.issues.map(issue => (
               { path: issue.path.join("."), message: issue.message }
          ));

          response.status(400).json({ errors: handleIssueZod });
     }

     // Handle if error is ResponseError
     if (error instanceof ResponseError) {
          response.status(error.status).json({ errors: error.message });
     }

     response.status(500).json({ errors: "Internal server erorrs"});
}