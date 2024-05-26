import { db } from "../app";
import { DBError } from "../controllers/DBError";
import type { AllUsersDBModel } from "../modeles/AllUsersDBModel";
import type { UserLoginDBModel } from "../modeles/auth/UserLoginDBModel";
import { ticket_1, ticket_2, ticket_3 } from "../tickets";
import { HTTP_STATUSES } from "../utils";
import { userCollection } from "./db";

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
	answerId: string;
	questionNumber: number;
};
const getCorrectAnswer = ({
	ticketNumber,
	answerId,
	questionNumber,
}: TypeGetCorrectAnswer) => {
	const ticket = tickets[ticketNumber - 1];

	if (questionNumber < 1 || ticket.length < questionNumber) {
		throw new DBError(
			`Указанный номер вопроса не найден, всего вопросов: ${ticket.length}`,
			HTTP_STATUSES.NOT_FOUND_404,
		);
	}

	const isExistAnswer =
		ticket[questionNumber - 1].answers.find((answer) => {
			return answer.id === answerId;
		}) || "";

	if (!isExistAnswer) {
		throw new DBError(
			`Указанный ответ ${answerId} не найден`,
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
		question.answers.find((question) => question.isCorrect)?.id || "";

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
		answerId: string,
	) {
		const correctAnswer = getCorrectAnswer({
			ticketNumber,
			questionNumber,
			answerId,
		});

		const isCorrect = correctAnswer.correctAnswer === answerId;

		const filter = { id: userId };
		const user = await userCollection.findOne(filter);

		if (!user) {
			throw new DBError("Пользователь не найден", HTTP_STATUSES.NOT_FOUND_404);
		}

		const ticketObject = `results.ticket_${ticketNumber}`;
		let ticket = user.results[ticketObject];

		if (!ticket) ticket = [];

		ticket[questionNumber - 1] = {
			isCorrect,
			answerId,
		};

		const update = {
			$set: {
				[ticketObject]: ticket,
			},
		};
		const options = { upsert: true };

		await userCollection.updateOne(filter, update, options);

		return { ...correctAnswer, isCorrect };
	},
};
