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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const index_1 = require("../index");
const userAssets_1 = require("../assets/userAssets");
const requestAssets_1 = require("../assets/requestAssets");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, firstName, secondName, password } = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(password, salt);
        const _id = (0, uuid_1.v4)();
        //Проверка наличия документа
        const filePath = (0, userAssets_1.getUserFilePath)(email);
        const isExistUser = yield index_1.db.exists(filePath);
        if (isExistUser) {
            res.status(400).json({ message: "Пользователь уже существует" });
            return;
        }
        yield index_1.db.push(filePath, {
            email,
            firstName,
            secondName,
            passwordHash: hash,
            _id,
        });
        const user = yield index_1.db.getData(filePath);
        const userCopy = Object.assign({}, user);
        userCopy.passwordHash = undefined;
        jsonwebtoken_1.default.sign({ _id: userCopy._id }, "somthingStrangeString", {
            expiresIn: "30d",
        });
        res.json(Object.assign({}, userCopy));
    }
    catch (error) {
        (0, requestAssets_1.sendError)({ message: "Не удалось зарегистрироваться", error, res });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const filePath = (0, userAssets_1.getUserFilePath)(email);
        const isExistUser = yield index_1.db.exists(filePath);
        if (!isExistUser) {
            res.status(404).json({ message: "Пользователь не существует" });
            return;
        }
        const user = yield index_1.db.getData(filePath);
        const isValidPass = yield bcrypt_1.default.compare(password, user.passwordHash);
        if (!isValidPass) {
            res.status(400).json({ message: "Логин или пароль не верен" });
            return;
        }
        const { _id, firstName, secondName } = user;
        const token = jsonwebtoken_1.default.sign({ _id }, "somthingStrangeString", {
            expiresIn: "30d",
        });
        res.json({ firstName, secondName, token });
    }
    catch (error) {
        if (error instanceof Error) {
            (0, requestAssets_1.sendError)({ message: "Не удалось авторизоваться", error, res });
        }
        (0, requestAssets_1.sendError)({ message: "Не удалось авторизоваться", res });
    }
});
exports.login = login;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, userAssets_1.isUserExist)(req, res);
        if (!user)
            return;
        const userCopy = Object.assign({}, user);
        userCopy.passwordHash = undefined;
        res.json(Object.assign({}, userCopy));
    }
    catch (error) {
        (0, requestAssets_1.sendError)({
            message: "Нет доступа",
            error,
            res,
        });
    }
});
exports.getMe = getMe;
