import { Router } from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { UserController } from "../controller/user-controller";
import { ContactController } from "../controller/contact-controller";
import { AddressController } from "../controller/address-controller";

export const privateRouter : Router = Router();

privateRouter.use(authMiddleware);

// Users API
privateRouter.get("/api/v1/users/me", UserController.getUser);
privateRouter.patch("/api/v1/users/update", UserController.updateUser);
privateRouter.delete("/api/v1/users/logout", UserController.logoutUser);

// Contacts API
privateRouter.post("/api/v1/contacts", ContactController.createContact);
privateRouter.get("/api/v1/contacts/:contactId(\\d+)", ContactController.getContact);
privateRouter.put("/api/v1/contacts/:contactId(\\d+)", ContactController.updateContact);
privateRouter.delete("/api/v1/contacts/:contactId(\\d+)", ContactController.removeContact);
privateRouter.get("/api/v1/contacts/search", ContactController.searchContact);

// Addresses API
privateRouter.post("/api/v1/contacts/:contactId(\\d+)/addresses", AddressController.createAddress);
privateRouter.get("/api/v1/contacts/:contactId(\\d+)/addresses/:addressId(\\d+)", AddressController.getAddress);
privateRouter.put("/api/v1/contacts/:contactId(\\d+)/addresses/:addressId(\\d+)", AddressController.updateAddress);
privateRouter.delete("/api/v1/contacts/:contactId(\\d+)/addresses/:addressId(\\d+)", AddressController.removeAddress);
privateRouter.get("/api/v1/contacts/:contactId(\\d+)/addresses", AddressController.getAddressesByContact);