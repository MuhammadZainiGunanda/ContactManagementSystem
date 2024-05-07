"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth-middleware");
const user_controller_1 = require("../controller/user-controller");
const contact_controller_1 = require("../controller/contact-controller");
const address_controller_1 = require("../controller/address-controller");
exports.privateRouter = (0, express_1.Router)();
exports.privateRouter.use(auth_middleware_1.authMiddleware);
// Users API
exports.privateRouter.get("/api/v1/users/me", user_controller_1.UserController.getUser);
exports.privateRouter.patch("/api/v1/users/update", user_controller_1.UserController.updateUser);
exports.privateRouter.delete("/api/v1/users/logout", user_controller_1.UserController.logoutUser);
// Contacts API
exports.privateRouter.post("/api/v1/contacts", contact_controller_1.ContactController.createContact);
exports.privateRouter.get("/api/v1/contacts/:contactId(\\d+)", contact_controller_1.ContactController.getContact);
exports.privateRouter.put("/api/v1/contacts/:contactId(\\d+)", contact_controller_1.ContactController.updateContact);
exports.privateRouter.delete("/api/v1/contacts/:contactId(\\d+)", contact_controller_1.ContactController.removeContact);
exports.privateRouter.get("/api/v1/contacts/search", contact_controller_1.ContactController.searchContact);
// Addresses API
exports.privateRouter.post("/api/v1/contacts/:contactId(\\d+)/addresses", address_controller_1.AddressController.createAddress);
exports.privateRouter.get("/api/v1/contacts/:contactId(\\d+)/addresses/:addressId(\\d+)", address_controller_1.AddressController.getAddress);
exports.privateRouter.put("/api/v1/contacts/:contactId(\\d+)/addresses/:addressId(\\d+)", address_controller_1.AddressController.updateAddress);
exports.privateRouter.delete("/api/v1/contacts/:contactId(\\d+)/addresses/:addressId(\\d+)", address_controller_1.AddressController.removeAddress);
exports.privateRouter.get("/api/v1/contacts/:contactId(\\d+)/addresses", address_controller_1.AddressController.getAddressesByContact);
