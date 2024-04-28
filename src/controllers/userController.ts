import { isUserExist } from "../assets/userAssets";
import { sendError } from "../assets/requestAssets";
import { Response } from "express";
import { ErrorType, RequestWithBody } from "../types";
import { BodyRegisterModel } from "../modeles/auth/BodyRegisterModel";
import { UserRegisterViewModel } from "../modeles/auth/UserRegisterViewModel";
import { BodyLoginModel } from "../modeles/auth/BodyLoginModel";
import { UserLoginViewModel } from "../modeles/auth/UserLoginViewModel";
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

export const getMe = async (req: Request, res: Response) => {
	try {
		//@ts-ignore
		const user = await isUserExist(req, res);
		if (!user) return;

		const userCopy = { ...user };
		//@ts-ignore
		userCopy.passwordHash = undefined;

		res.json({ ...userCopy });
	} catch (error) {
		sendError({
			message: "Нет доступа",
			error,
			res,
		});
	}
};
