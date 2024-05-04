import { db } from "../app";
import type { AllUsersDBModel } from "../modeles/AllUsersDBModel";
import type { UserLoginDBModel } from "../modeles/auth/UserLoginDBModel";
import { HTTP_STATUSES } from "../utils";
import { DBError } from "../controllers/DBError";

const getUserFilePath = (email: string) => {
	const filePath = `./users/${email}`;
	return filePath;
};

const isUserExist = async (userId: string) => {
	const users: AllUsersDBModel[] = await db.getData("/users");
	const user: UserLoginDBModel | null = findUserById(users, userId);

	if (user) return user;

	throw new DBError("Пользователь не найден", HTTP_STATUSES.NOT_FOUND_404);
};

const findUserById = (
	users: AllUsersDBModel[],
	id: string,
): UserLoginDBModel | null => {
	for (const key in users) {
		//@ts-ignore
		if (users[key]._id === id) {
			//@ts-ignore
			return users[key];
		}
	}
	return null;
};

export const ticketRepository = {
	async sendTicketsCount(userId: string) {
		const user = await isUserExist(userId);
		if (user) return user;
		throw new DBError("Пользователь не найден", HTTP_STATUSES.NOT_FOUND_404);
	},

	async sendTicket() {},
};
