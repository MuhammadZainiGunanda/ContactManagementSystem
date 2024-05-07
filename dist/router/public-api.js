"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("../controller/user-controller");
exports.publicRouter = (0, express_1.Router)();
// User API
exports.publicRouter.post("/api/v1/users/register", user_controller_1.UserController.registrationUser);
exports.publicRouter.post("/api/v1/users/login", user_controller_1.UserController.loginUser);
