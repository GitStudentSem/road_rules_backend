import { db } from "../app";
import { DBError } from "../controllers/DBError";
import type { AllUsersDBModel } from "../modeles/AllUsersDBModel";
import type { UserLoginDBModel } from "../modeles/auth/UserLoginDBModel";
import { ticket_1, ticket_2, ticket_3 } from "../tickets";
import { HTTP_STATUSES } from "../utils";

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

	console.log({
		ticketNumber,
		answerId,
		questionNumber,
	});

	console.log("ticket", ticket);
	const isExistAnswer =
		ticket[questionNumber - 1].answers.find((answer) => {
			return answer.id === answerId;
		}) || "";

	console.log("isExistAnswer", isExistAnswer);

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
		const user = await isUserExist(userId);
		isTicketExist(ticketNumber);

		const filePath = getUserFilePath(user.email);
		const pathToAnswer = `${filePath}/results/ticket-${ticketNumber}`;

		const isExistAnswer = await db.exists(pathToAnswer);
		if (!isExistAnswer) await db.push(pathToAnswer, Array(20).fill(-1));

		const copyAnswers = await db.getData(pathToAnswer);

		copyAnswers[questionNumber - 1] = answerId;
		await db.push(pathToAnswer, copyAnswers);

		const correctAnswer = getCorrectAnswer({
			ticketNumber: ticketNumber,
			questionNumber,
			answerId,
		});

		return correctAnswer;
	},
};
