import { Request, Response } from "express";
import { db } from "../app";
import { AllUsersDBModel } from "../modeles/AllUsersDBModel";
import { UserLoginDBModel } from "../modeles/auth/UserLoginDBModel";

export const getUserFilePath = (email: string) => {
	const filePath = `./users/${email}`;
	return filePath;
};

export const isUserExist = async (req: Request, res: Response) => {
	//@ts-ignore
	const userId: string = req.userId;
	const users: AllUsersDBModel[] = await db.getData("/users");
	const user: UserLoginDBModel | null = findUserById(users, userId);
	if (!user) {
		res.status(404).json({ message: "Пользователь не найден" });
		return null;
	}
	return user;
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
