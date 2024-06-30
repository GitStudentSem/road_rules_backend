import { DBError } from "../controllers/DBError";
import { HTTP_STATUSES } from "../utils";
import { userCollection } from "./db";

const isUserExist = async (userId: string) => {
	const filter = { userId };
	const user = await userCollection.findOne(filter);
	if (!user) {
		throw new DBError("Пользователь не найден", HTTP_STATUSES.NOT_FOUND_404);
	}
	return user;
};

const checkAccessByRole = (role: string) => {
	if (role === "user") {
		throw new DBError("У вас нет прав доступа", HTTP_STATUSES.BAD_REQUEST_400);
	}
};

export const userEditorRepository = {
	async getAllUsers(userId: string) {
		const allUsers = await userCollection.find({}).toArray();
		const user = await isUserExist(userId);
		checkAccessByRole(user.role);
		return allUsers;
	},

	async setRole(data: {
		userId: string;
		email: string;
		role: "user" | "admin";
	}) {
		const { userId, email, role } = data;

		const user = await isUserExist(userId);

		checkAccessByRole(user.role);

		if (user.role === "superadmin") {
			throw new DBError(
				"Вы не можете менять роль для супер администратора",
				HTTP_STATUSES.BAD_REQUEST_400,
			);
		}

		const result = await userCollection.updateOne(
			{ email },
			{ $set: { role } },
		);

		if (result.matchedCount === 0) {
			throw new DBError(
				"При обновлении роли произошло ошибка",
				HTTP_STATUSES.BAD_REQUEST_400,
			);
		}
	},

	async appointExam(data: {
		isAppoint: boolean;
		email: string;
		userId: string;
	}) {
		const { userId, isAppoint, email } = data;

		const user = await isUserExist(userId);

		checkAccessByRole(user.role);

		const update = {
			$set: {
				isAppointExam: isAppoint,
			},
		};

		await userCollection.updateOne({ email }, update, { upsert: true });
	},
};
