import type { Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";

// Путь к файлу с логами
const logFilePath = path.join(__dirname, "logs.txt");

type TypeError = {
	status?: number;
	message?: string;
	error?: any;
	req: Request;
	res: Response;
};

// Функция для записи в лог
function logMessage({
	message = "Неизвестная ошибка",
	error,
	req,
}: { message: string; error: any; req: Request }) {
	const dateOptions: Intl.DateTimeFormatOptions = {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	};
	const formattedDate = new Date().toLocaleDateString("ru-RU", dateOptions);
	const referer = req.get("Referer");

	const logEntry = `[${formattedDate}] ${message}\n Адрес: ${referer}\n${error?.stack}\n`;

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
	req,
	res,
}: TypeError) => {
	logMessage({ message, error, req });
	error && console.log(message, error);
	return res.status(status).send({ message });
};
