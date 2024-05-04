import { db } from "../app";
import type { AllUsersDBModel } from "../modeles/AllUsersDBModel";
import type { UserLoginDBModel } from "../modeles/auth/UserLoginDBModel";
import { HTTP_STATUSES } from "../utils";
import { DBError } from "../controllers/DBError";
import { ticket_1, ticket_2, ticket_3 } from "../tickets";

const tickets = [ticket_1, ticket_2, ticket_3];

const getUserFilePath = (email: string) => {
	const filePath = `./users/${email}`;
	return filePath;
};

const getTiket = (ticketNumber: number) => {
	const ticket = tickets[ticketNumber - 1];
	// const ticketWithoutAnswers = removeCorrectAnswersFromTicket(ticket);
	return ticket;
};

const isTicketExist = (ticketNumber: number) => {
	if (!ticketNumber) {
		throw new DBError("Не указан номер билета", HTTP_STATUSES.BAD_REQUEST_400);
	}

	const ticketsCount = tickets.length;

	if (ticketNumber > ticketsCount || ticketNumber < 1) {
		throw new DBError(
			`Указанный билет не существует, всего билетов: ${ticketsCount}`,
			HTTP_STATUSES.NOT_FOUND_404,
		);
	}

	return tickets[ticketNumber - 1];
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

type TypeGetCorrectAnswer = {
	ticketNumber: number;
	userAnswer: number;
	questionNumber: number;
};
const getCorrectAnswer = ({
	ticketNumber,
	questionNumber,
	userAnswer,
}: TypeGetCorrectAnswer) => {
	const ticket = tickets[ticketNumber - 1];

	if (questionNumber < 1 || ticket.length < questionNumber) {
		throw new DBError(
			`Указанный номер вопроса не найден, всего вопросов: ${ticket.length}`,
			HTTP_STATUSES.NOT_FOUND_404,
		);
	}
	const answersLength = ticket[questionNumber - 1].answers.length;

	if (userAnswer < 1 || userAnswer > answersLength) {
		throw new DBError(
			`Указанный номер ответа не найден, всего ответов: ${answersLength}`,
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

	const correctAnswer =
		question.answers.findIndex((question) => question.isCorrect) + 1 || -1; // Просто отрицательное число, что бы бло ясно что он не нашелся

	return {
		correctAnswer,
		help: question.help,
	};
};

export const ticketRepository = {
	async sendTicketsCount(userId: string) {
		await isUserExist(userId);

		return tickets.length;
	},

	async sendTicket(userId: string, ticketNumber: number) {
		await isUserExist(userId);

		const ticket = isTicketExist(ticketNumber);

		return ticket;
	},

	async sendTicketResult(
		userId: string,
		ticketNumber: number,
		questionNumber: number,
		userAnswer: number,
	) {
		const user = await isUserExist(userId);
		isTicketExist(ticketNumber);

		const filePath = getUserFilePath(user.email);
		const pathToAnswer = `${filePath}/results/ticket-${ticketNumber}`;

		const isExistAnswer = await db.exists(pathToAnswer);
		if (!isExistAnswer) await db.push(pathToAnswer, Array(20).fill(-1));

		const copyAnswers = await db.getData(pathToAnswer);

		copyAnswers[questionNumber - 1] = userAnswer;
		await db.push(pathToAnswer, copyAnswers);

		const correctAnswer = getCorrectAnswer({
			ticketNumber: ticketNumber,
			questionNumber,
			userAnswer,
		});

		return correctAnswer;
	},
};
