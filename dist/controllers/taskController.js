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
exports.sendExamTicketResult = exports.sendExam = exports.sendTicketResult = exports.sendTicket = exports.sendTicketsCount = void 0;
const requestAssets_1 = require("../assets/requestAssets");
const userAssets_1 = require("../assets/userAssets");
const index_js_1 = require("../index.js");
const tasksAssets_1 = require("../assets/tasksAssets");
const sendTicketsCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, userAssets_1.isUserExist)(req, res);
        if (!user)
            return;
        res.json({ ticketsCount: (0, tasksAssets_1.getCountTickets)() });
    }
    catch (error) {
        (0, requestAssets_1.sendError)({ message: "Не удалось отправить билет", error, res });
    }
});
exports.sendTicketsCount = sendTicketsCount;
const sendTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, userAssets_1.isUserExist)(req, res);
        if (!user)
            return;
        const { ticketNumber } = req.params;
        const ticket = (0, tasksAssets_1.isTicketExist)(Number(ticketNumber), res);
        res.json(ticket);
    }
    catch (error) {
        (0, requestAssets_1.sendError)({ message: "Не удалось отправить билет", error, res });
    }
});
exports.sendTicket = sendTicket;
const sendTicketResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, userAssets_1.isUserExist)(req, res);
        if (!user)
            return;
        const { ticketNumber } = req.params;
        const { userAnswer, questionNumber } = req.body;
        const ticket = (0, tasksAssets_1.isTicketExist)(Number(ticketNumber), res);
        if (!ticket)
            return;
        const result = (0, tasksAssets_1.checkUserAnswer)({
            ticketNumber: Number(ticketNumber),
            userAnswer,
            questionNumber,
            res,
        });
        if (!result)
            return;
        const filePath = (0, userAssets_1.getUserFilePath)(user.email);
        const pathToAnswer = `${filePath}/results/ticket-${ticketNumber}`;
        const isExistAnswer = yield index_js_1.db.exists(pathToAnswer);
        if (!isExistAnswer)
            yield index_js_1.db.push(pathToAnswer, Array(20).fill(-1));
        const copyAnswers = yield index_js_1.db.getData(pathToAnswer);
        copyAnswers[questionNumber - 1] = userAnswer;
        yield index_js_1.db.push(pathToAnswer, copyAnswers);
        res.json(result);
    }
    catch (error) {
        (0, requestAssets_1.sendError)({ message: "Не удалось отправить билет", error, res });
    }
});
exports.sendTicketResult = sendTicketResult;
const sendExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, userAssets_1.isUserExist)(req, res);
        if (!user)
            return;
        res.json((0, tasksAssets_1.getExam)());
    }
    catch (error) {
        (0, requestAssets_1.sendError)({ message: "Не удалось отправить билет", error, res });
    }
});
exports.sendExam = sendExam;
const sendExamTicketResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, userAssets_1.isUserExist)(req, res);
        if (!user)
            return;
        const { ticketNumber } = req.params;
        const { userAnswer, questionNumber } = req.body;
        const ticket = (0, tasksAssets_1.isTicketExist)(Number(ticketNumber), res);
        if (!ticket)
            return;
        const result = (0, tasksAssets_1.checkUserAnswer)({
            ticketNumber: Number(ticketNumber),
            userAnswer,
            questionNumber,
            res,
        });
        if (!result)
            return;
        const filePath = (0, userAssets_1.getUserFilePath)(user.email);
        const pathToAnswer = `${filePath}/results/exam`;
        const isExistAnswer = yield index_js_1.db.exists(pathToAnswer);
        if (!isExistAnswer)
            yield index_js_1.db.push(pathToAnswer, Array(20).fill(-1));
        const copyAnswers = yield index_js_1.db.getData(pathToAnswer);
        copyAnswers[questionNumber - 1] = userAnswer;
        yield index_js_1.db.push(pathToAnswer, copyAnswers);
        res.json(result);
    }
    catch (error) {
        (0, requestAssets_1.sendError)({ message: "Не удалось отправить билет", error, res });
    }
});
exports.sendExamTicketResult = sendExamTicketResult;
// export const sendExam = async (req, res) => {
// 	try {
// 		const user = await isUserExist(req, res);
// 		if (!user) return;
// 		const filePath = getUserFilePath(user.firstName, user.secondName);
// 		const userAnswers = req.body;
// 		await db.push(`${filePath}/results/exam`, userAnswers);
// 		const result = checkExam(userAnswers);
// 		res.json(result);
// 	} catch (error) {
// 		sendError({ message: "Не удалось отправить билет", error, res });
// 	}
// };
// export const getOne = async (req, res) => {
// 	try {
// 		const user = await isUserExist(req, res);
// 		if (!user) return;
// 		const filePath = getUserFilePath(user.firstName, user.secondName);
// 		const ticketNumber = req.params.ticket;
// 		const isExistTasks = await db.exists(`${filePath}/tasks/${ticketNumber}`);
// 		if (!isExistTasks)
// 			return res.status(404).json({ message: "Ответ не найден" });
// 		const answers = await db.getData(`${filePath}/tasks/${ticketNumber}`);
// 		res.json(answers);
// 	} catch (error) {
// 		sendError({ message: "Не удалось получить результаты", error, res });
// 	}
// };
// export const getAll = async (req, res) => {
// 	try {
// 		const user = await isUserExist(req, res);
// 		if (!user) return;
// 		const filePath = getUserFilePath(user.firstName, user.secondName);
// 		const isExistTasks = await db.exists(`${filePath}/tasks`);
// 		if (!isExistTasks)
// 			return res.status(404).json({ message: "Ответы не найдены" });
// 		const answers = await db.getData(`${filePath}/tasks`);
// 		res.json(answers);
// 	} catch (error) {
// 		sendError({ message: "Не удалось получить результаты", error, res });
// 	}
// };
// export const removeOne = async (req, res) => {
// 	try {
// 		const user = await isUserExist(req, res);
// 		if (!user) return;
// 		const filePath = getUserFilePath(user.firstName, user.secondName);
// 		const ticketNumber = req.params.ticket;
// 		const isExistTasks = await db.exists(`${filePath}/tasks/${ticketNumber}`);
// 		if (!isExistTasks)
// 			return res.status(404).json({ message: "Ответ не найден" });
// 		await db.delete(`${filePath}/tasks/${ticketNumber}`);
// 		res.status(200).json({ message: `Билет ${ticketNumber} удален` });
// 	} catch (error) {
// 		sendError({ message: "Не удалось удалить результаты", error, res });
// 	}
// };
// export const remove = async (req, res) => {
// 	try {
// 		const user = await isUserExist(req, res);
// 		if (!user) return;
// 		const filePath = getUserFilePath(user.firstName, user.secondName);
// 		await db.delete(`${filePath}/tasks`);
// 		res.status(200).json({ message: "Все билеты удалены" });
// 	} catch (error) {
// 		sendError({ message: "Не удалось удалить результаты", error, res });
// 	}
// };
