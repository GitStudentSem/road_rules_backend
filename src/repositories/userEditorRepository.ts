import { DBError } from "../controllers/DBError";
import { HTTP_STATUSES } from "../utils";
import { userCollection } from "./db";

export const isUserExist = async (userId: string) => {
	const filter = { userId };
	const user = await userCollection.findOne(filter);
	if (!user) {
		throw new DBError("Пользователь не найден", HTTP_STATUSES.NOT_FOUND_404);
	}
	return user;
};

export const userEditorRepository = {
	async getAllUsers() {
		const allUsers = await userCollection.find({}).toArray();
		return allUsers;
	},

	async setRole(data: {
		userId: string;
		email: string;
		role: "user" | "admin";
	}) {
		const { userId, email, role } = data;

		const user = await isUserExist(userId);

		if (user.role === "superadmin") {
			throw new DBError(
				"Вы не можете менять роль для супер администратора",
				HTTP_STATUSES.BAD_REQUEST_400,
			);
		}

		if (user.role === "user") {
			throw new DBError(
				"У вас нет прав доступа, для смены роли",
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

	async appointExam(data: { isAppoint: boolean; email: string }) {
		const { isAppoint, email } = data;

		const user = await userCollection.findOne({ email });

		if (!user) {
			throw new DBError("Пользователь не найден", HTTP_STATUSES.NOT_FOUND_404);
		}

		const update = {
			$set: {
				isAppointExam: isAppoint,
			},
		};

		await userCollection.updateOne({ email }, update, { upsert: true });
	},
};
