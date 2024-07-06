import { HTTP_STATUSES } from "../utils";
import { DBError } from "../controllers/DBError";
import { userCollection } from "./db";

export const isUserExist = async (userId: string) => {
	const filter = { userId };
	const user = await userCollection.findOne(filter);
	if (!user) {
		throw new DBError("Пользователь не найден", HTTP_STATUSES.NOT_FOUND_404);
	}
	return user;
};

export const authRepository = {
	async register(data: {
		email: string;
		firstName: string;
		secondName: string;
		passwordHash: string;
	}) {
		const { email, firstName, secondName, passwordHash } = data;

		const isAlreadyExistUser = await userCollection.findOne({ email });

		if (isAlreadyExistUser) {
			throw new DBError(
				"Пользователь уже существует",
				HTTP_STATUSES.BAD_REQUEST_400,
			);
		}

		const userId = Number(new Date()).toString();

		await userCollection.insertOne({
			email,
			firstName,
			secondName,
			passwordHash,
			userId,
			isAppointExam: false,
			role: "user",
			results: {},
		});

		const user = await userCollection.findOne({ email });

		if (!user) {
			throw new DBError(
				"Пользователь не найден",
				HTTP_STATUSES.BAD_REQUEST_400,
			);
		}

		return user;
	},

	async login(data: { email: string }) {
		const { email } = data;

		const user = await userCollection.findOne({ email });

		if (!user) {
			throw new DBError(
				"Логин или пароль не верен",
				HTTP_STATUSES.NOT_FOUND_404,
			);
		}
		return user;
	},

	async adminLogin(data: { email: string }) {
		const { email } = data;

		const user = await userCollection.findOne({ email });

		if (!user) {
			throw new DBError(
				"Логин или пароль не верен",
				HTTP_STATUSES.NOT_FOUND_404,
			);
		}

		if (user.role === "user") {
			throw new DBError("Доступ запрещен", HTTP_STATUSES.BAD_REQUEST_400);
		}

		return user;
	},

	async deleteUser(data: { userId: string; email: string }) {
		const { userId, email } = data;
		const user = await isUserExist(userId);
		if (user.role === "user") {
			throw new DBError("Доступ запрещен", HTTP_STATUSES.BAD_REQUEST_400);
		}
		const userForDelete = await userCollection.findOne({ email });
		if (!userForDelete) {
			throw new DBError(
				"Пользователь для удаления не найден",
				HTTP_STATUSES.NOT_FOUND_404,
			);
		}
		if (userForDelete.role === "superadmin") {
			throw new DBError(
				"Вы не можете удалить супер администратора",
				HTTP_STATUSES.NOT_FOUND_404,
			);
		}
		await userCollection.deleteOne({ email });
	},
};
