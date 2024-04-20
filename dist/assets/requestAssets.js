"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = void 0;
const sendError = ({ status = 500, message = "Неизвестная ошибка", error, res, }) => {
    console.log(message, error);
    return res.status(status).send({ message });
};
exports.sendError = sendError;
