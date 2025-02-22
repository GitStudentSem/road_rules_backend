import { DBError } from "../controllers/DBError";
import type { CreateQuestionDBModel } from "../types/DBModels";
import type {
	GetQuestionInTicket,
	SendTicketResult,
} from "../types/repositories/ticketsRepository";
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
	const filter = { userId };
	const user = await userCollection.findOne(filter);
	if (!user) {
		throw new DBError("Пользователь не найден", HTTP_STATUSES.NOT_FOUND_404);
	}
	return user;
};

const getTicketsIds = async () => {
	const query = { questions: { $ne: [] } };
	const projection = { ticketId: 1 };
	const cursor = await ticketCollection
		.find(query, { projection })
		.sort({ createdAt: 1 })
		.toArray();

	const ticketIds: string[] = [];
	for (const doc of cursor) {
		ticketIds.push(doc.ticketId);
	}

	return ticketIds;
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

		const ticketObjectName = `results.ticket_${ticketId}.passAt`;
		const update = {
			$set: {
				[ticketObjectName]: Number(new Date()),
			},
		};

		await userCollection.updateOne({ userId }, update, { upsert: true });

		return ticket;
	},

	async sendTicketResult(data: SendTicketResult) {
		const { userId, ticketId, questionId, answerId } = data;

		const user = await isUserExist(userId);
		const question = await isQuestionExist(ticketId, questionId);
		const correctAnswerId =
			question.answers.find((answer) => answer.isCorrect)?.answerId || "";
		const isCorrect = correctAnswerId === answerId;

		const ticketObjectName = `results.ticket_${ticketId}.result`;
		let ticketResult = user.results[ticketObjectName]?.result;

		if (!ticketResult) ticketResult = [];
		ticketResult.push({ ticketId, questionId, answerId, isCorrect });
		const update = {
			$set: {
				[ticketObjectName]: ticketResult,
			},
		};

		await userCollection.updateOne({ userId }, update, { upsert: true });

		return question;
	},

	async sendFailedQuestions(data: { userId: string }) {
		const { userId } = data;
		await isUserExist(userId);

		interface IResult {
			result: {
				ticketId: string;
				questionId: string;
				answerId: string;
				isCorrect: boolean;
			};
		}
		//@ts-ignore
		const result: Promise<IResult[]> = await userCollection
			.aggregate([
				{
					$project: {
						resultsArray: { $objectToArray: "$results" }, // Преобразуем объект results в массив
					},
				},
				{
					$unwind: "$resultsArray", // Разворачиваем массив результатов по каждому билету
				},
				{
					$unwind: "$resultsArray.v.result", // Разворачиваем массив result внутри каждого билета
				},
				{
					$match: {
						"resultsArray.v.result.isCorrect": false, // Фильтруем только те результаты, где isCorrect == false
					},
				},
				{
					$project: {
						_id: 0,
						// ticketId: "$resultsArray.k", // ID билета (ключ объекта)
						// passAt: "$resultsArray.v.passAt", // Время прохождения
						result: "$resultsArray.v.result", // Результат вопроса
					},
				},
			])
			.toArray();

		return result;
	},

	async getQuestionInTicket(data: GetQuestionInTicket) {
		const { ticketId, questionId } = data;
		const question = await isQuestionExist(ticketId, questionId);
		return question;
	},
};
