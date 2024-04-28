import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { db } from "../app";
import { getUserFilePath, isUserExist } from "../assets/userAssets";
import { sendError } from "../assets/requestAssets";
import { Response } from "express";
import { ErrorType, RequestWithBody } from "../types";
import { BodyRegisterModel } from "../modeles/auth/BodyRegisterModel";
import { UserRegisterViewModel } from "../modeles/auth/UserRegisterViewModel";
import { BodyLoginModel } from "../modeles/auth/BodyLoginModel";
import { UserLoginViewModel } from "../modeles/auth/UserLoginViewModel";
import { UserLoginDBModel } from "../modeles/auth/UserLoginDBModel";
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

		const filePath = getUserFilePath(email);

		const isExistUser = await db.exists(filePath);

		if (!isExistUser) {
			res
				.status(HTTP_STATUSES.NOT_FOUND_404)
				.json({ message: "Логин или пароль не верен" });
			return;
		}

		const user: UserLoginDBModel = await db.getData(filePath);

		const isValidPass = await bcrypt.compare(password, user.passwordHash);
		if (!isValidPass) {
			res
				.status(HTTP_STATUSES.BAD_REQUEST_400)
				.json({ message: "Логин или пароль не верен" });
			return;
		}

		const { _id, firstName, secondName } = user;

		const token = jwt.sign({ _id }, "somthingStrangeString", {
			expiresIn: "30d",
		});

		res.status(HTTP_STATUSES.OK_200).json({ firstName, secondName, token });
	} catch (error) {
		if (error instanceof Error) {
			sendError({ message: "Не удалось авторизоваться", error, res });
		}
		sendError({ message: "Не удалось авторизоваться", res });
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
