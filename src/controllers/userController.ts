import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { db } from "../app";
import { getUserFilePath, isUserExist } from "../assets/userAssets";
import { sendError } from "../assets/requestAssets";
import { Response } from "express";
import { ErrorType, RequestWithBody } from "../types";
import { BodyRegisterModel } from "../modeles/auth/BodyRegisterModel";
import { UserRegisterViewModel } from "../modeles/auth/UserViewModel";
import { UserRegisterDBModel } from "../modeles/auth/UserRegisterDBModel";
import { BodyLoginModel } from "../modeles/auth/BodyLoginModel";
import { UserLoginViewModel } from "../modeles/auth/UserLoginViewModel";
import { UserLoginDBModel } from "../modeles/auth/UserLoginDBModel";

export const register = async (
	req: RequestWithBody<BodyRegisterModel>,
	res: Response<UserRegisterViewModel | ErrorType>,
) => {
	try {
		const { email, firstName, secondName, password } = req.body;
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const _id = uuidv4();

		//Проверка наличия документа
		const filePath = getUserFilePath(email);

		const isExistUser = await db.exists(filePath);

		if (isExistUser) {
			res.status(400).json({ message: "Пользователь уже существует" });
			return;
		}

		const newUser = {
			email,
			firstName,
			secondName,
			passwordHash: hash,
			_id,
		};
		await db.push(filePath, newUser);

		const user: UserRegisterDBModel = await db.getData(filePath);

		jwt.sign({ _id: user._id }, "somthingStrangeString", {
			expiresIn: "30d",
		});

		const userWithoutPasswordHash = {
			email,
			firstName,
			secondName,
			_id,
		};
		res.json(userWithoutPasswordHash);
	} catch (error) {
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
			res.status(404).json({ message: "Пользователь не существует" });
			return;
		}

		const user: UserLoginDBModel = await db.getData(filePath);

		const isValidPass = await bcrypt.compare(password, user.passwordHash);
		if (!isValidPass) {
			res.status(400).json({ message: "Логин или пароль не верен" });
			return;
		}

		const { _id, firstName, secondName } = user;

		const token = jwt.sign({ _id }, "somthingStrangeString", {
			expiresIn: "30d",
		});

		res.json({ firstName, secondName, token });
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
