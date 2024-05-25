import { v4 as uuidv4 } from "uuid";
import { HTTP_STATUSES } from "../utils";
import { DBError } from "../controllers/DBError";
import { userCollection } from "./db";

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

		const id = uuidv4();

		await userCollection.insertOne({
			email,
			firstName,
			secondName,
			passwordHash,
			id,
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

	async deleteUser(data: { email: string }) {
		const { email } = data;

		const deletedUser = await userCollection.deleteOne({ email });
		return deletedUser.deletedCount === 1;
	},
	async getAllUsers() {
		const allUsers = await userCollection.find({}).toArray();

		return allUsers;
	},
};
