import {
	getUserFilePath,
	isUserExist,
	sendError,
	checkExam,
	checkTicketAnswers,
} from "../assets.js";

import { db } from "../index.js";

export const sendTicket = async (req, res) => {
	try {
		const user = await isUserExist(req, res);
		if (!user) return;

		const filePath = getUserFilePath(user.email);

		const ticketNumber = req.params.ticket;
		const userAnswers = req.body;
		await db.push(`${filePath}/results/${ticketNumber}`, userAnswers);

		const result = checkTicketAnswers(ticketNumber, userAnswers);
		res.json(result);
	} catch (error) {
		sendError({ message: "Не удалось отправить билет", error, res });
	}
};

export const sendExam = async (req, res) => {
	try {
		const user = await isUserExist(req, res);
		if (!user) return;

		const filePath = getUserFilePath(user.email);

		const userAnswers = req.body;
		await db.push(`${filePath}/results/exam`, userAnswers);

		const result = checkExam(userAnswers);
		res.json(result);
	} catch (error) {
		sendError({ message: "Не удалось отправить билет", error, res });
	}
};

export const getOne = async (req, res) => {
	try {
		const user = await isUserExist(req, res);
		if (!user) return;

		const filePath = getUserFilePath(user.email);

		const ticketNumber = req.params.ticket;
		const isExistTasks = await db.exists(`${filePath}/tasks/${ticketNumber}`);
		if (!isExistTasks)
			return res.status(404).json({ message: "Ответ не найден" });

		const answers = await db.getData(`${filePath}/tasks/${ticketNumber}`);
		res.json(answers);
	} catch (error) {
		sendError({ message: "Не удалось получить результаты", error, res });
	}
};

export const getAll = async (req, res) => {
	try {
		const user = await isUserExist(req, res);
		if (!user) return;

		const filePath = getUserFilePath(user.email);

		const isExistTasks = await db.exists(`${filePath}/tasks`);
		if (!isExistTasks)
			return res.status(404).json({ message: "Ответы не найдены" });

		const answers = await db.getData(`${filePath}/tasks`);
		res.json(answers);
	} catch (error) {
		sendError({ message: "Не удалось получить результаты", error, res });
	}
};

export const removeOne = async (req, res) => {
	try {
		const user = await isUserExist(req, res);
		if (!user) return;

		const filePath = getUserFilePath(user.email);

		const ticketNumber = req.params.ticket;

		const isExistTasks = await db.exists(`${filePath}/tasks/${ticketNumber}`);
		if (!isExistTasks)
			return res.status(404).json({ message: "Ответ не найден" });

		await db.delete(`${filePath}/tasks/${ticketNumber}`);

		res.status(200).json({ message: `Билет ${ticketNumber} удален` });
	} catch (error) {
		sendError({ message: "Не удалось удалить результаты", error, res });
	}
};
export const remove = async (req, res) => {
	try {
		const user = await isUserExist(req, res);
		if (!user) return;

		const filePath = getUserFilePath(user.email);
		await db.delete(`${filePath}/tasks`);

		res.status(200).json({ message: "Все билеты удалены" });
	} catch (error) {
		sendError({ message: "Не удалось удалить результаты", error, res });
	}
};
