import type { Response } from "express";
import fs from "node:fs";
import path from "node:path";

// Путь к файлу с логами
const logFilePath = path.join(__dirname, "logs.txt");

type TypeError = {
	status?: number;
	message?: string;
	error?: any;
	res: Response;
};

// Функция для записи в лог
function logMessage({
	message = "Неизвестная ошибка",
	error,
}: { message: string; error: any }) {
	const timestamp = new Date().toISOString();
	const logEntry = `[${timestamp}] ${message}\n${error?.stack}\n`;

	// Запись в файл
	fs.appendFile(logFilePath, logEntry, (err) => {
		if (err) {
			console.error("Ошибка при записи в лог-файл:", err);
		} else {
			console.log("Сообщение добавлено в лог.");
		}
	});
}

export const sendError = ({
	status = 500,
	message = "Неизвестная ошибка",
	error,
	res,
}: TypeError) => {
	logMessage({ message, error });
	error && console.log(message, error);
	return res.status(status).send({ message });
};
