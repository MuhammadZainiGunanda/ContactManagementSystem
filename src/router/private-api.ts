import { Router } from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { UserController } from "../controller/user-controller";
import { ContactController } from "../controller/contact-controller";

export const privateRouter : Router = Router();

privateRouter.use(authMiddleware);

// User API
privateRouter.get("/api/users/me", UserController.getUser);
privateRouter.patch("/api/users/update", UserController.updateUser);
privateRouter.delete("/api/users/logout", UserController.logoutUser);

// Contact API
privateRouter.post("/api/contacts", ContactController.createContact);
privateRouter.get("/api/contacts/:contactId(\\d+)", ContactController.getContact);
privateRouter.put("/api/contacts/:contactId(\\d+)", ContactController.updateContact);
privateRouter.delete("/api/contacts/:contactId(\\d+)", ContactController.removeContact);
privateRouter.get("/api/contacts/search", ContactController.searchContact);