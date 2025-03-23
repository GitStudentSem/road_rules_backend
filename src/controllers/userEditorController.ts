import { sendError } from "../assets/requestAssets";
import type { Request, Response } from "express";
import type { ErrorType, RequestWithBody } from "../types";
import { HTTP_STATUSES } from "../utils";
import { DBError } from "./DBError";
import { userEditorService } from "../services/userEditorService";
import type {
	BodyDeleteUser,
	BodyGetExamResult,
	BodyGetUsersWithResultExam,
	BodyIsBannedForChat,
	BodySetRole,
	ViewClearQuestionInfo,
	ViewUserInfoResultExam,
} from "../types/controllers/userEditorController";
import type { ViewUserInfo } from "../types/controllers/userEditorController";
import type { BodyAppointExam } from "../types/controllers/userEditorController";

export const userEditorController = {
	async getAllUsers(req: Request, res: Response<ViewUserInfo[] | ErrorType>) {
		try {
			const allUsers = await userEditorService.getAllUsers(req.userId || "");

			res.status(HTTP_STATUSES.OK_200).json(allUsers);
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({
				error,
				res,
				req,
				message: "Не удалось получить всех пользователей",
			});
		}
	},

	async getUsersWithAppointExam(
		req: Request,
		res: Response<ViewUserInfo[] | ErrorType>,
	) {
		try {
			const allUsers = await userEditorService.getUsersWithAppointExam(
				req.userId || "",
			);

			res.status(HTTP_STATUSES.OK_200).json(allUsers);
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({
				error,
				res,
				req,
				message: "Не удалось получить пользователей с назначенным экзаменом",
			});
		}
	},

	async getUsersWithResultExam(
		req: RequestWithBody<BodyGetUsersWithResultExam>,
		res: Response<ViewUserInfoResultExam[] | ErrorType>,
	) {
		try {
			const allUsers = await userEditorService.getUsersWithResultExam(
				req.userId || "",
				req.body.isPassExam,
			);

			res.status(HTTP_STATUSES.OK_200).json(allUsers);
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({
				error,
				res,
				req,
				message: "Не удалось получить пользователей и их статус экзамена",
			});
		}
	},

	async setRole(req: RequestWithBody<BodySetRole>, res: Response<ErrorType>) {
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
				error,
				res,
				req,
				message: "Не удалось установить роль пользователя",
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
			sendError({
				error,
				res,
				req,
				message: "Не удалось назначить экзамен",
			});
		}
	},

	async deleteUser(
		req: RequestWithBody<BodyDeleteUser>,
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
			sendError({
				error,
				res,
				req,
				message: "Не удалось удалить пользователя",
			});
		}
	},

	async getExamResult(
		req: RequestWithBody<BodyGetExamResult>,
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
			sendError({
				error,
				res,
				req,
				message: "Не удалось получить результаты экзамена для пользователя",
			});
		}
	},

	async setIsBannedForChat(
		req: RequestWithBody<BodyIsBannedForChat>,
		res: Response<ErrorType>,
	) {
		try {
			await userEditorService.setIsBannedForChat({
				isBannedForChat: req.body.isBannedForChat,
				email: req.body.email,
				userId: req.userId || "",
			});

			res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({
				error,
				res,
				req,
				message: "Не удалось назначить экзамен",
			});
		}
	},
};
