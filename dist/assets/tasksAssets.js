"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExam = exports.checkUserAnswer = exports.getTiket = exports.getCountTickets = exports.isTicketExist = exports.tickets = void 0;
const tickets_1 = require("../tickets");
const fs_1 = __importDefault(require("fs"));
const requestAssets_js_1 = require("./requestAssets.js");
exports.tickets = [tickets_1.ticket_1, tickets_1.ticket_2, tickets_1.ticket_3];
const imageToBase64 = (imagePath) => {
    const image = fs_1.default.readFileSync(imagePath, { encoding: "base64" });
    return image;
};
const isTicketExist = (ticketNumber, res) => {
    if (!ticketNumber) {
        (0, requestAssets_js_1.sendError)({ message: "Не указан номер билета", res });
        return null;
    }
    const ticketsCount = (0, exports.getCountTickets)();
    if (ticketNumber > ticketsCount || ticketNumber < 1) {
        (0, requestAssets_js_1.sendError)({
            message: `Указанный билет не существует, всего билетов: ${ticketsCount}`,
            res,
        });
        return null;
    }
    return (0, exports.getTiket)(ticketNumber);
};
exports.isTicketExist = isTicketExist;
const removeCorrectAnswersFromTicket = (ticket) => {
    return ticket.map((question) => {
        return Object.assign(Object.assign({}, question), { img: `data:image/jpeg;base64,${imageToBase64(question.img)}`, answers: question.answers.map((answer) => answer.text) });
    });
};
const getCountTickets = () => exports.tickets.length;
exports.getCountTickets = getCountTickets;
const getTiket = (ticketNumber) => {
    const ticket = exports.tickets[ticketNumber - 1];
    const ticketWithoutAnswers = removeCorrectAnswersFromTicket(ticket);
    return ticketWithoutAnswers;
};
exports.getTiket = getTiket;
const checkUserAnswer = ({ ticketNumber, userAnswer, questionNumber, res, }) => {
    const ticket = exports.tickets[ticketNumber - 1];
    if (!ticket) {
        (0, requestAssets_js_1.sendError)({
            message: `Указанный билет не существует, всего билетов: ${(0, exports.getCountTickets)()}`,
            res,
        });
        return null;
    }
    const question = ticket[questionNumber - 1];
    if (!question) {
        (0, requestAssets_js_1.sendError)({
            message: "Указанный номер вопроса не существует",
            res,
        });
        return null;
    }
    const answer = question.answers[userAnswer - 1];
    if (!answer) {
        (0, requestAssets_js_1.sendError)({
            message: "Указанный номер ответа не существует",
            res,
        });
        return null;
    }
    return { isCorrect: answer.isCorrect };
};
exports.checkUserAnswer = checkUserAnswer;
function randomInteger(min, max) {
    // случайное число от min до (max+1)
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}
const getExam = () => {
    const questions = [];
    for (let i = 0; i < 20; i++) {
        const ticketNumber = randomInteger(1, exports.tickets.length);
        const question = exports.tickets[ticketNumber - 1][i];
        questions.push(Object.assign(Object.assign({}, question), { ticketNumber }));
    }
    const questionsWithoutAnswers = removeCorrectAnswersFromTicket(questions);
    return questionsWithoutAnswers;
};
exports.getExam = getExam;
