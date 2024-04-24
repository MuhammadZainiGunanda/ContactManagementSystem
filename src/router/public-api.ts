import { Router } from "express";
import { UserController } from "../controller/user-controller";

export const publicRouter : Router = Router();

publicRouter.post("/api/users/register", UserController.createUserRegistration);
publicRouter.post("/api/users/login", UserController.loginUserCredentials);