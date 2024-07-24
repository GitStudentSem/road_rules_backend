import { sendError } from "../assets/requestAssets";
import type { Request, Response } from "express";
import type { ErrorType, RequestWithBody } from "../types";
import { HTTP_STATUSES } from "../utils";
import { DBError } from "./DBError";
import { userEditorService } from "../services/userEditorService";
import type { ViewClearQuestionInfo } from "../types/controllers/userEditorController";
import type { GetAllUsersViewModel } from "../models/auth/GetAllUsersViewModel";
import type { BodyAppointExam } from "../models/exam/BodyAppointExam";

export const userEditorController = {
	async getAllUsers(
		req: Request,
		res: Response<GetAllUsersViewModel[] | ErrorType>,
	) {
		try {
			const allUsers = await userEditorService.getAllUsers(req.userId || "");

			res.status(HTTP_STATUSES.OK_200).json(allUsers);
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
	},

	async setRole(
		req: RequestWithBody<{ email: string; role: "user" | "admin" }>,
		res: Response<ErrorType>,
	) {
		try {
			const { email, role } = req.body;

			await userEditorService.setRole({
				userId: req.userId || "",
				email,
				role,
			});

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
	},

	async appointExam(
		req: RequestWithBody<BodyAppointExam>,
		res: Response<ErrorType>,
	) {
		try {
			await userEditorService.appointExam({
				isAppoint: req.body.isAppoint,
				email: req.body.email,
				userId: req.userId || "",
			});

			res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({ message: "Не удалось назначить экзамен", error, res });
		}
	},

	async deleteUser(
		req: RequestWithBody<{ email: string }>,
		res: Response<ErrorType>,
	) {
		try {
			await userEditorService.deleteUser({
				userId: req.userId || "",
				email: req.body.email,
			});

			res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({ message: "Не удалось удалить пользователя", error, res });
		}
	},

	async getExamResult(
		req: RequestWithBody<{ email: string }>,
		res: Response<ViewClearQuestionInfo[] | ErrorType>,
	) {
		try {
			const examResut = await userEditorService.getExamResult({
				email: req.body.email,
				userId: req.userId || "",
			});

			res.send(examResut);
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({ message: "Не удалось удалить пользователя", error, res });
		}
	},
};
