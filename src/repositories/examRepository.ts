import { db } from "../app";
import { DBError } from "../controllers/DBError";
import type { AllUsersDBModel } from "../modeles/AllUsersDBModel";
import type { UserLoginDBModel } from "../modeles/auth/UserLoginDBModel";
import type { TypeQuestion } from "../types";
import { HTTP_STATUSES } from "../utils";
import { ticket_1, ticket_2, ticket_3 } from "../tickets";

const tickets = [ticket_1, ticket_2, ticket_3];

const getQuestion = (ticketNumber: number, questionNumber: number) => {
	const ticket = tickets[ticketNumber - 1];
	if (!ticket) {
		throw new DBError(
			`Указанный билет не существует, всего билетов: ${tickets.length}`,
			HTTP_STATUSES.NOT_FOUND_404,
		);
	}

	if (questionNumber < 1 || ticket.length < questionNumber) {
		throw new DBError(
			`Указанный номер вопроса не найден, всего вопросов: ${ticket.length}`,
			HTTP_STATUSES.NOT_FOUND_404,
		);
	}

	const question = ticket[questionNumber - 1];

	if (!question) {
		throw new DBError(
			"Указанный номер вопроса не существует",
			HTTP_STATUSES.NOT_FOUND_404,
		);
	}

	return question;
	///////
};

const randomInteger = (min: number, max: number) => {
	// случайное число от min до (max+1)
	const rand = min + Math.random() * (max + 1 - min);
	return Math.floor(rand);
};

const getExam = () => {
	type ExtendedType = TypeQuestion & {
		ticketNumber: number;
	};

	const questions: ExtendedType[] = [];
	for (let i = 0; i < 20; i++) {
		const ticketNumber = randomInteger(1, tickets.length);
		const question = tickets[ticketNumber - 1][i];
		questions.push({ ...question, ticketNumber });
	}

	return questions;
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

const isUserExist = async (userId: string) => {
	const users: AllUsersDBModel[] = await db.getData("/users");
	const user: UserLoginDBModel | null = findUserById(users, userId);

	if (user) return user;

	throw new DBError("Пользователь не найден", HTTP_STATUSES.NOT_FOUND_404);
};

const getUserFilePath = (email: string) => {
	const filePath = `./users/${email}`;
	return filePath;
};

export const examRepository = {
	async sendExam(userId: string) {
		await isUserExist(userId);
		const exam = getExam();
		return exam;
	},

	async sendExamResult(
		userId: string,
		ticketNumber: number,
		questionNumber: number,
		answerId: string,
	) {
		const user = await isUserExist(userId);
		const question = getQuestion(ticketNumber, questionNumber);

		const filePath = getUserFilePath(user.email);
		const pathToAnswer = `${filePath}/results/exam`;

		const isExistAnswer = await db.exists(pathToAnswer);
		if (!isExistAnswer) await db.push(pathToAnswer, Array(20).fill(-1));

		const copyAnswers = await db.getData(pathToAnswer);

		copyAnswers[questionNumber - 1] = answerId;
		await db.push(pathToAnswer, copyAnswers);

		return question;
	},
};