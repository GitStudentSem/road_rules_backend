import { db } from "../index.js";

export const getUserFilePath = (email) => {
	const filePath = `./users/${email}`;
	return filePath;
};

export const isUserExist = async (req, res) => {
	const userId = req.userId;
	const users = await db.getData("/users");
	const user = findUserById(users, userId);
	if (!user) {
		res.status(404).json({ message: "Пользователь не найден" });
		return false;
	}
	return user;
};

export const findUserById = (users, id) => {
	for (const key in users) {
		if (users[key]._id === id) {
			return users[key];
		}
	}
	return null;
};
