import { Router } from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { UserController } from "../controller/user-controller";

export const privateRouter : Router = Router();

privateRouter.use(authMiddleware);

// User API
privateRouter.get("/api/users/me", UserController.getUser);
privateRouter.patch("/api/users/update", UserController.updateUser);
privateRouter.delete("/api/users/logout", UserController.logoutUser);