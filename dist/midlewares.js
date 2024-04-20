"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValudationErrors = exports.checkAuth = void 0;
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const requestAssets_js_1 = require("./assets/requestAssets.js");
const checkAuth = (req, res, next) => {
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, "somthingStrangeString");
            req.userId = decoded._id;
            next();
        }
        catch (error) {
            (0, requestAssets_js_1.sendError)({
                status: 403,
                message: "Токен доступа неверен или истек",
                error,
                res,
            });
        }
    }
    else {
        return res.status(403).json({ message: "Токен доступа не был получен" });
    }
};
exports.checkAuth = checkAuth;
const handleValudationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const message = errors.array()[0].msg;
        return res.status(400).json({ message });
    }
    next();
};
exports.handleValudationErrors = handleValudationErrors;
