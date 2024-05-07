"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webApplication = void 0;
const express_1 = __importDefault(require("express"));
const public_api_1 = require("../router/public-api");
const error_middleware_1 = require("../middleware/error-middleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const private_api_1 = require("../router/private-api");
dotenv_1.default.config();
exports.webApplication = (0, express_1.default)();
exports.webApplication.use(express_1.default.json());
exports.webApplication.use((0, cookie_parser_1.default)());
exports.webApplication.use(public_api_1.publicRouter);
exports.webApplication.use(private_api_1.privateRouter);
exports.webApplication.use(error_middleware_1.errorMiddleware);
