"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.answerValidation = exports.registerValidation = exports.loginValidation = void 0;
const express_validator_1 = require("express-validator");
exports.loginValidation = [
    (0, express_validator_1.body)("email", "Почта должна быть строкой").isString(),
    (0, express_validator_1.body)("email", "Длина почты должна быть больше 2 символов").isLength({
        min: 6,
    }),
    (0, express_validator_1.body)("email", "Длина почты должна быть больше 2 символов").isEmail(),
    (0, express_validator_1.body)("password", "Пароль должен быть строкой").isString(),
    (0, express_validator_1.body)("password", "Пароль должен быть минимум 5 символов").isLength({
        min: 5,
    }),
];
exports.registerValidation = [
    (0, express_validator_1.body)("email", "Почта должна быть строкой").isString(),
    (0, express_validator_1.body)("email", "Длина почты должна быть больше 2 символов").isLength({
        min: 6,
    }),
    (0, express_validator_1.body)("email", "Длина почты должна быть больше 2 символов").isEmail(),
    (0, express_validator_1.body)("firstName", "Имя должно быть строкой").isString(),
    (0, express_validator_1.body)("firstName", "Длина имени должна быть больше 2 символов").isLength({
        min: 2,
    }),
    (0, express_validator_1.body)("secondName", "Фамилия должна быть строкой").isString(),
    (0, express_validator_1.body)("secondName", "Длина фамилии должна быть больше 2 символов").isLength({
        min: 2,
    }),
    (0, express_validator_1.body)("password", "Пароль должен быть строкой").isString(),
    (0, express_validator_1.body)("password", "Пароль должен быть минимум 5 символов").isLength({
        min: 5,
    }),
];
exports.answerValidation = [
    (0, express_validator_1.body)("userAnswer", "Ответ пользователя должен быть числом").isNumeric(),
    (0, express_validator_1.body)("questionNumber", "Номер вопроса должен быть числом").isNumeric(),
];
