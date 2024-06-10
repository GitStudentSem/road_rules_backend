import { DBError } from "../controllers/DBError";
import type { CreateQuestionDBModel } from "../models/editor/CreateQuestionDBModel";
import { ticket_1, ticket_2, ticket_3 } from "../tickets";
import { HTTP_STATUSES } from "../utils";
import { ticketCollection, userCollection } from "./db";

const ticketsOld = [ticket_1, ticket_2, ticket_3];

const isTicketExist = async (ticketId: string) => {
	const ticket = await ticketCollection.findOne({ ticketId });
	if (!ticket) {
		throw new DBError("Билет не найден", HTTP_STATUSES.NOT_FOUND_404);
	}

	return ticket;
};
const isQuestionExist = async (
	ticketId: string,
	questionId: string,
): Promise<CreateQuestionDBModel> => {
	console.log("ticketId, questionID", ticketId, questionId);
	const question = await ticketCollection
		.aggregate([
			{ $match: { ticketId } },
			{ $unwind: "$questions" },
			{ $match: { "questions.questionId": questionId } },
			{
				$replaceRoot: { newRoot: "$questions" },
			},
		])
		.toArray();
	// console.log("question", question);
	// console.log("question[0]", question[0]);
	if (!question)
		throw new DBError(
			"Указанный билет или вопрос не найден",
			HTTP_STATUSES.NOT_FOUND_404,
		);
	//@ts-ignore
	return question[0];
};

const isUserExist = async (userId: string) => {
	const filter = { id: userId };
	const user = await userCollection.findOne(filter);

	if (!user) {
		throw new DBError("Пользователь не найден", HTTP_STATUSES.NOT_FOUND_404);
	}
	return user;
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

	async sendTicket(userId: string, ticketId: string) {
		await isUserExist(userId);

		const ticket = await isTicketExist(ticketId);

		return ticket;
	},

	async sendTicketResult(data: {
		userId: string;
		ticketId: string;
		questionId: string;
	}) {
		/**
		 * Сделать ставку ответов пользователя
		 * Формат еще нужно будет доработать
		 * Сейчас он создает только поле для вставки
		 */
		const { userId, ticketId, questionId } = data;
		const question = await isQuestionExist(ticketId, questionId);

		const filter = { id: userId };
		const user = await isUserExist(userId);

		const ticketObjectName = `results.ticket_${ticketId}`;
		let ticket = user.results[ticketObjectName];

		if (!ticket) ticket = [];

		const update = {
			$set: {
				[ticketObjectName]: ticket,
			},
		};
		const options = { upsert: true };

		await userCollection.updateOne(filter, update, options);

		return question;
	},
};
