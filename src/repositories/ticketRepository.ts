import { DBError } from "../controllers/DBError";
import type { CreateQuestionDBModel } from "../models/editor/CreateQuestionDBModel";
import { HTTP_STATUSES } from "../utils";
import { ticketCollection, userCollection } from "./db";

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

const getTicketsIds = async () => {
	const ticketsIds = await ticketCollection
		.aggregate<{ ticketId: string }>([
			// Сортируем документы по полю 'createdAt'
			{ $sort: { createdAt: 1 } },

			// Группируем по 'ticketId' и добавляем уникальные ticketId в массив
			{ $group: { _id: "$ticketId", createdAt: { $first: "$createdAt" } } },

			// Проектируем только ticketId
			{ $project: { _id: 0, ticketId: "$_id" } },

			// Финальная сортировка по полю 'createdAt'
			{ $sort: { createdAt: 1 } },
		])
		.toArray();

	return ticketsIds;
};

const removePreviousAnswers = async (userId: string, ticketId: string) => {
	const ticketObjectName = `results.ticket_${ticketId}`;

	await userCollection.updateOne(
		{ userId },
		{ $unset: { [ticketObjectName]: "" } },
	);
};

export const ticketRepository = {
	async sendTickets(userId: string) {
		await isUserExist(userId);
		const ticketsIds = await getTicketsIds();
		return ticketsIds;
	},

	async sendTicket(userId: string, ticketId: string) {
		await isUserExist(userId);
		await removePreviousAnswers(userId, ticketId);

		const ticket = await isTicketExist(ticketId);

		return ticket;
	},

	async sendTicketResult(data: {
		userId: string;
		ticketId: string;
		questionId: string;
		answerId: string;
	}) {
		/**
		 * Сделать ставку ответов пользователя
		 * Формат еще нужно будет доработать
		 * Сейчас он создает только поле для вставки
		 */
		const { userId, ticketId, questionId, answerId } = data;
		const user = await isUserExist(userId);
		const question = await isQuestionExist(ticketId, questionId);
		const correctAnswerId =
			question.answers.find((answer) => answer.isCorrect)?.answerId || "";
		const isCorrect = correctAnswerId === answerId;

		const ticketObjectName = `results.ticket_${ticketId}`;
		let ticketResult = user.results[ticketObjectName];

		if (!ticketResult) ticketResult = [];
		ticketResult.push({ ticketId, questionId, answerId, isCorrect });
		const update = {
			$set: {
				[ticketObjectName]: ticketResult,
			},
		};

		await userCollection.updateOne({ id: userId }, update, { upsert: true });

		return question;
	},
};
