import { sendError } from "../assets/requestAssets";
import type { Response } from "express";
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
		const { email, firstName, secondName, password, department } = req.body;

		const registerdUser = await authService.register({
			email,
			firstName,
			secondName,
			password,
			department,
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
		sendError({ message: "Не удалось войти в систему", error, res });
	}
};
export const adminLogin = async (
	req: RequestWithBody<BodyLoginModel>,
	res: Response<UserLoginViewModel | ErrorType>,
) => {
	try {
		const { email, password } = req.body;

		const loginnedUser = await authService.adminLogin({ email, password });

		res.status(HTTP_STATUSES.OK_200).json(loginnedUser);
	} catch (error) {
		if (error instanceof DBError) {
			res.status(error.status).json({ message: error.message });
			return;
		}
		sendError({ message: "Не удалось войти в систему", error, res });
	}
};
