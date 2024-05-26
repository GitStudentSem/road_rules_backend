import { DBError } from "../controllers/DBError";
import type { TypeQuestion } from "../types";
import { HTTP_STATUSES } from "../utils";
import { ticket_1, ticket_2, ticket_3 } from "../tickets";
import { userCollection } from "./db";

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

const isUserExist = async (userId: string) => {
	const filter = { id: userId };
	const user = await userCollection.findOne(filter);

	if (!user) {
		throw new DBError("Пользователь не найден", HTTP_STATUSES.NOT_FOUND_404);
	}
	return user;
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
		const question = getQuestion(ticketNumber, questionNumber);
		const correctAnswerId =
			question.answers.find((question) => question.isCorrect)?.id || ""; // Просто отрицательное число, что бы бло ясно что он не нашелся

		const isCorrect = correctAnswerId === answerId;
		const filter = { id: userId };

		const user = await isUserExist(userId);

		let exam = user.results.exam;

		if (!exam) exam = [];

		exam[questionNumber - 1] = {
			isCorrect,
			answerId,
		};

		const update = {
			$set: {
				"results.exam": exam,
			},
		};
		const options = { upsert: true };
		await userCollection.updateOne(filter, update, options);

		return {
			isCorrect,
			correctAnswer: correctAnswerId,
			help: isCorrect ? "" : question.help,
		};
	},
};
