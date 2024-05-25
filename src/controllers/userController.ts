import { sendError } from "../assets/requestAssets";
import type { Response, Request } from "express";
import type { ErrorType, RequestWithBody, RequestWithParams } from "../types";
import type { BodyRegisterModel } from "../modeles/auth/BodyRegisterModel";
import type { UserRegisterViewModel } from "../modeles/auth/UserRegisterViewModel";
import type { BodyLoginModel } from "../modeles/auth/BodyLoginModel";
import type { UserLoginViewModel } from "../modeles/auth/UserLoginViewModel";
import { HTTP_STATUSES } from "../utils";
import { DBError } from "./DBError";
import { authService } from "../domain/authService";
import type { UserLoginDBModel } from "../modeles/auth/UserLoginDBModel";

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

export const deleteUser = async (
	req: RequestWithParams<{ email: string }>,
	res: Response<{ isDeleted: boolean } | ErrorType>,
) => {
	try {
		const { email } = req.params;

		const isDeleted = await authService.deleteUser({ email });

		res.status(HTTP_STATUSES.OK_200).json({ isDeleted });
	} catch (error) {
		if (error instanceof DBError) {
			res.status(error.status).json({ message: error.message });
			return;
		}
		sendError({ message: "Не удалось удалить пользователя", error, res });
	}
};

export const getAllUsers = async (
	req: Request,
	res: Response<{ allUsers: UserLoginDBModel[] } | ErrorType>,
) => {
	try {
		const allUsers = await authService.getAllUsers();

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

// export const getMe = async (req: Request, res: Response) => {
// 	try {
// 		//@ts-ignore
// 		const user = await isUserExist(req, res);
// 		if (!user) return;

// 		const userCopy = { ...user };
// 		//@ts-ignore
// 		userCopy.passwordHash = undefined;

// 		res.json({ ...userCopy });
// 	} catch (error) {
// 		sendError({
// 			message: "Нет доступа",
// 			error,
// 			res,
// 		});
// 	}
// };
