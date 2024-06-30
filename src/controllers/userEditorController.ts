import { sendError } from "../assets/requestAssets";
import type { Request, Response } from "express";
import type { ErrorType, RequestWithBody } from "../types";
import { HTTP_STATUSES } from "../utils";
import { DBError } from "./DBError";
import { userEditorService } from "../domain/userEditorService";
import type { GetAllUsersViewModel } from "../models/auth/GetAllUsersViewModel";
import type { BodyAppointExam } from "../models/exam/BodyAppointExam";

export const getAllUsers = async (
	req: Request,
	res: Response<{ allUsers: GetAllUsersViewModel[] } | ErrorType>,
) => {
	try {
		const allUsers = await userEditorService.getAllUsers();

		res.status(HTTP_STATUSES.OK_200).json({ allUsers });
	} catch (error) {
		if (error instanceof DBError) {
			res.status(error.status).json({ message: error.message });
			return;
		}
		sendError({
			message: "Не удалось получить всех пользователей",
			error,
			res,
		});
	}
};

export const setRole = async (
	req: RequestWithBody<{ email: string; role: "user" | "admin" }>,
	res: Response<ErrorType>,
) => {
	try {
		const { email, role } = req.body;

		await userEditorService.setRole({ userId: req.userId || "", email, role });

		res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
	} catch (error) {
		if (error instanceof DBError) {
			res.status(error.status).json({ message: error.message });
			return;
		}
		sendError({
			message: "Не удалось установить роль пользователя",
			error,
			res,
		});
	}
};

export const appointExam = async (
	req: RequestWithBody<BodyAppointExam>,
	res: Response<ErrorType>,
) => {
	try {
		await userEditorService.appointExam({
			isAppoint: req.body.isAppoint,
			email: req.body.email,
		});

		res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
	} catch (error) {
		if (error instanceof DBError) {
			res.status(error.status).json({ message: error.message });
			return;
		}
		sendError({ message: "Не удалось отправить билет", error, res });
	}
};
