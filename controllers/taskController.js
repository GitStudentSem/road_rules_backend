import { sendError } from "../assets/requestAssets.js";
import { getUserFilePath, isUserExist } from "../assets/userAssets.js";
import { db } from "../index.js";
import {
	checkUserAnswer,
	getCountTickets,
	getTiket,
	isTicketExist,
} from "../assets/tasksAssets.js";

export const sendTicketsCount = async (req, res) => {
	try {
		const user = await isUserExist(req, res);
		if (!user) return;

		res.json({ ticketsCount: getCountTickets() });
	} catch (error) {
		sendError({ message: "Не удалось отправить билет", error, res });
	}
};

export const sendTicket = async (req, res) => {
	try {
		const user = await isUserExist(req, res);
		if (!user) return;

		const { ticketNumber } = req.params;

		const ticket = isTicketExist(ticketNumber, res);
		res.json(ticket);
	} catch (error) {
		sendError({ message: "Не удалось отправить билет", error, res });
	}
};

export const sendTicketResult = async (req, res) => {
	try {
		const user = await isUserExist(req, res);

		if (!user) return;

		const { ticketNumber } = req.params;
		const { userAnswer, questionNumber } = req.body;

		const ticket = isTicketExist(ticketNumber, res);
		if (!ticket) return;

		const result = checkUserAnswer({
			ticketNumber,
			userAnswer,
			questionNumber,
			res,
		});

		if (!result) return;

		const filePath = getUserFilePath(user.email);
		const pathToAnswer = `${filePath}/results/ticket-${ticketNumber}`;

		const isExistAnswer = await db.exists(pathToAnswer);
		if (!isExistAnswer) await db.push(pathToAnswer, Array(20).fill(-1));

		const copyAnswers = await db.getData(pathToAnswer);

		copyAnswers[questionNumber - 1] = userAnswer;
		await db.push(pathToAnswer, copyAnswers);

		res.json(result);
	} catch (error) {
		sendError({ message: "Не удалось отправить билет", error, res });
	}
};

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
