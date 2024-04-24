import { Response } from "express";

type TypeError = {
	status?: number;
	message?: string;
	error?: any;
	res: Response;
};
export const sendError = ({
	status = 500,
	message = "Неизвестная ошибка",
	error,
	res,
}: TypeError) => {
	console.log(message, error);
	return res.status(status).send({ message });
};
