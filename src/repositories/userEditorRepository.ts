import { DBError } from "../controllers/DBError";
import type {
	AppointExam,
	DeleteUser,
	GetExamResult,
	SetRole,
} from "../types/repositories/userEditorRepository";
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

const checkAccessByRole = async (userId: string) => {
	const user = await isUserExist(userId);

	if (user.role === "user") {
		throw new DBError("У вас нет прав доступа", HTTP_STATUSES.BAD_REQUEST_400);
	}
};

export const userEditorRepository = {
	async getAllUsers(userId: string) {
		await checkAccessByRole(userId);

		const allUsers = await userCollection.find({}).toArray();
		return allUsers;
	},

	async getUsersWithAppointExam(userId: string) {
		await checkAccessByRole(userId);

		const allUsers = await userCollection
			.find({ isAppointExam: true })
			.toArray();

		return allUsers;
	},

	async setRole(data: SetRole) {
		const { userId, email, role } = data;

		await isUserExist(userId);
		await checkAccessByRole(userId);

		const userForupdateRole = await userCollection.findOne({ email });
		if (!userForupdateRole) {
			throw new DBError(
				"Пользователь для обновления роли не найден",
				HTTP_STATUSES.NOT_FOUND_404,
			);
		}
		if (userForupdateRole.role === "superadmin") {
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
				"При обновлении роли произошла ошибка",
				HTTP_STATUSES.BAD_REQUEST_400,
			);
		}
	},

	async appointExam(data: AppointExam) {
		const { userId, isAppoint, email } = data;

		await checkAccessByRole(userId);

		const update = {
			$set: {
				isAppointExam: isAppoint,
			},
		};

		await userCollection.updateOne({ email }, update, { upsert: true });
	},

	async deleteUser(data: DeleteUser) {
		const { userId, email } = data;
		await checkAccessByRole(userId);

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

	async getExamResult(data: GetExamResult) {
		const { email, userId } = data;

		await checkAccessByRole(userId);

		const userForResultsExam = await userCollection.findOne({ email });
		if (!userForResultsExam) {
			throw new DBError(
				"Пользователь с таким email не найден",
				HTTP_STATUSES.NOT_FOUND_404,
			);
		}

		const result = userForResultsExam.results.exam?.result;
		if (!result) {
			throw new DBError(
				"Экзамен еще не был сдан, получить результаты невозможно",
				HTTP_STATUSES.NOT_FOUND_404,
			);
		}
		return result;
	},
};
