import { sendError } from "../assets/requestAssets";
import type { Request, Response } from "express";
import type { ErrorType, RequestWithBody } from "../types";
import type { BodyRegisterModel } from "../models/auth/BodyRegisterModel";
import type { UserRegisterViewModel } from "../models/auth/UserRegisterViewModel";
import type { BodyLoginModel } from "../models/auth/BodyLoginModel";
import type { UserLoginViewModel } from "../models/auth/UserLoginViewModel";
import { HTTP_STATUSES } from "../utils";
import { DBError } from "./DBError";
import { authService } from "../domain/authService";

export const register = async (
	req: RequestWithBody<BodyRegisterModel>,
	res: Response<UserRegisterViewModel | ErrorType>,
) => {
	try {
		const { email, firstName, secondName, password } = req.body;

		const registerdUser = await authService.register({
			email,
			firstName,
			secondName,
			password,
		});

		res.status(HTTP_STATUSES.OK_200).json(registerdUser);
	} catch (error) {
		if (error instanceof DBError) {
			res.status(error.status).json({ message: error.message });
			return;
		}
		sendError({ message: "Не удалось зарегистрироваться", error, res });
	}
};

export const login = async (
	req: RequestWithBody<BodyLoginModel>,
	res: Response<UserLoginViewModel | ErrorType>,
) => {
	try {
		const { email, password } = req.body;

		const loginnedUser = await authService.login({ email, password });

		res.status(HTTP_STATUSES.OK_200).json(loginnedUser);
	} catch (error) {
		if (error instanceof DBError) {
			res.status(error.status).json({ message: error.message });
			return;
		}
		sendError({ message: "Не удалось зарегистрироваться", error, res });
	}
};

export const deleteUser = async (req: Request, res: Response<ErrorType>) => {
	try {
		await authService.deleteUser({ userId: req.userId || "" });

		res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
	} catch (error) {
		if (error instanceof DBError) {
			res.status(error.status).json({ message: error.message });
			return;
		}
		sendError({ message: "Не удалось удалить пользователя", error, res });
	}
};
