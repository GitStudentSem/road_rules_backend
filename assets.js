import { db } from "./index.js";

export const getUserFilePath = (email) => {
	const filePath = `./users/${email}`;
	return filePath;
};

export const sendError = ({
	status = 500,
	message = "Неизвестная ошибка",
	error,
	res,
}) => {
	console.log(message, error);
	return res.status(status).send({ message });
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

const answersData = [
	[2, 1, 1, 4, 2, 2, 4, 3, 1, 3, 1, 3, 3, 1, 3, 4, 3, 4, 3, 2],
	[2, 1, 1, 3, 3, 1, 3, 3, 1, 3, 3, 2, 3, 3, 1, 3, 2, 1, 3, 3],
	[1, 3, 3, 2, 2, 3, 2, 1, 3, 3, 3, 2, 2, 1, 3, 3, 4, 2, 3, 3],
];

export const checkTicketAnswers = (ticket, userAnswers) => {
	let errorsCount = 0;
	for (let i = 0; i < userAnswers.length; i++) {
		const userAnswer = userAnswers[i];
		const correctAnswer = answersData[ticket - 1][i];

		if (userAnswer !== correctAnswer) errorsCount++;
	}

	return { result: errorsCount <= 2, correctAnswers: answersData[ticket] };
};

export const checkExam = (userAnswers) => {
	try {
		let errorsCount = 0;

		const correctAnswers = [];
		for (let i = 0; i < userAnswers.length; i++) {
			const { ticket, question, answer } = userAnswers[i];

			const correctAnswer = answersData[ticket - 1][question - 1];

			correctAnswers.push(correctAnswer);

			if (answer !== correctAnswer) errorsCount++;
		}

		return { result: errorsCount <= 2, correctAnswers };
	} catch (error) {
		console.log(error);
	}
};
