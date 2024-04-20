"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserExist = exports.getUserFilePath = void 0;
const index_js_1 = require("../index.js");
const getUserFilePath = (email) => {
    const filePath = `./users/${email}`;
    return filePath;
};
exports.getUserFilePath = getUserFilePath;
const isUserExist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const users = yield index_js_1.db.getData("/users");
    const user = findUserById(users, userId);
    if (!user) {
        res.status(404).json({ message: "Пользователь не найден" });
        return false;
    }
    return user;
});
exports.isUserExist = isUserExist;
const findUserById = (users, id) => {
    for (const key in users) {
        if (users[key]._id === id) {
            return users[key];
        }
    }
    return null;
};
