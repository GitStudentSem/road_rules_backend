import { v4 as uuidv4 } from "uuid";
import { HTTP_STATUSES } from "../utils";
import { db } from "../app";
import type { UserRegisterDBModel } from "../modeles/auth/UserRegisterDBModel";
import { DBError } from "../controllers/DBError";
import type { UserLoginDBModel } from "../modeles/auth/UserLoginDBModel";

const getUserFilePath = (email: string) => {
	const filePath = `./users/${email}`;
	return filePath;
};

export const authRepository = {
	async register(data: {
		email: string;
		firstName: string;
		secondName: string;
		passwordHash: string;
	}) {
		const { email, firstName, secondName, passwordHash } = data;

		const filePath = getUserFilePath(email);

		const isExistUser = await db.exists(filePath);

		if (isExistUser) {
			throw new DBError(
				"Пользователь уже существует",
				HTTP_STATUSES.BAD_REQUEST_400,
			);
		}

		const _id = uuidv4();

		const newUser = {
			email,
			firstName,
			secondName,
			passwordHash,
			_id,
		};
		await db.push(filePath, newUser);

		const user: UserRegisterDBModel = await db.getData(filePath);

		return user;
	},

	async login(data: { email: string }) {
		const { email } = data;

		const filePath = getUserFilePath(email);

		const isExistUser = await db.exists(filePath);

		if (!isExistUser) {
			throw new DBError(
				"Логин или пароль не верен",
				HTTP_STATUSES.NOT_FOUND_404,
			);
		}

		const user: UserLoginDBModel = await db.getData(filePath);

		return user;
	},
};
