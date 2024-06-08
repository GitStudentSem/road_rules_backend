import { DBError } from "../controllers/DBError";
import { ticket_1, ticket_2, ticket_3 } from "../tickets";
import { HTTP_STATUSES } from "../utils";
import { ticketCollection, userCollection } from "./db";

const ticketsOld = [ticket_1, ticket_2, ticket_3];

const isTicketExist = (ticketNumber: number) => {
	if (!ticketNumber) {
		throw new DBError("Не указан номер билета", HTTP_STATUSES.BAD_REQUEST_400);
	}

	const ticketsCount = ticketsOld.length;

	if (ticketNumber > ticketsCount || ticketNumber < 1) {
		throw new DBError(
			`Указанный билет не существует, всего билетов: ${ticketsCount}`,
			HTTP_STATUSES.NOT_FOUND_404,
		);
	}

	return ticketsOld[ticketNumber - 1];
};

const isUserExist = async (userId: string) => {
	const filter = { id: userId };
	const user = await userCollection.findOne(filter);

	if (!user) {
		throw new DBError("Пользователь не найден", HTTP_STATUSES.NOT_FOUND_404);
	}
	return user;
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
	const ticket = ticketsOld[ticketNumber - 1];

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
	async sendTickets(userId: string) {
		await isUserExist(userId);
		const tickets = await ticketCollection
			.find()
			.sort({ createdAt: 1 })
			.toArray();

		return tickets;
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
		const user = await isUserExist(userId);

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
