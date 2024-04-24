import { Request, Response } from "express";
import { db } from "../app";

export const getUserFilePath = (email: string) => {
	const filePath = `./users/${email}`;
	return filePath;
};

export const isUserExist = async (req: Request, res: Response) => {
	//@ts-ignore
	const userId = req.userId;
	const users = await db.getData("/users");
	const user = findUserById(users, userId);
	if (!user) {
		res.status(404).json({ message: "Пользователь не найден" });
		return false;
	}
	return user;
};

const findUserById = (users: any[], id: string) => {
	for (const key in users) {
		if (users[key]._id === id) {
			return users[key];
		}
	}
	return null;
};
