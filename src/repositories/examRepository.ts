import { DBError } from "../controllers/DBError";

import { HTTP_STATUSES } from "../utils";
import { ticket_1, ticket_2, ticket_3 } from "../tickets";
import { ticketCollection, userCollection } from "./db";

import type { CreateQuestionDBModel } from "../models/editor/CreateQuestionDBModel";
import { header } from "express-validator";

const tickets = [ticket_1, ticket_2, ticket_3];

const isTicketExist = async (ticketId: string) => {
	const ticket = await ticketCollection.findOne({ ticketId });
	if (!ticket) {
		throw new DBError("Билет не найден", HTTP_STATUSES.NOT_FOUND_404);
	}

	return ticket;
};

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

const getRandomTicket = async () => {
	const ticketsIds = await getTicketsIds();
	const randomIndex = randomInteger(0, ticketsIds.length - 1);
	return ticketsIds[randomIndex].ticketId;
};

const isUserExist = async (userId: string) => {
	const filter = { id: userId };
	const user = await userCollection.findOne(filter);

	if (!user) {
		throw new DBError("Пользователь не найден", HTTP_STATUSES.NOT_FOUND_404);
	}
	return user;
};
export type QuestionWithTicketId = CreateQuestionDBModel & {
	ticketId: string;
};

export const examRepository = {
	async sendExam(userId: string) {
		await isUserExist(userId);

		const tickets: QuestionWithTicketId[] = [];
		let i = 0;
		while (i <= 20) {
			const ticketId = await getRandomTicket();
			const ticket = await isTicketExist(ticketId);
			const randomIndex = randomInteger(0, ticket.questions.length - 1);
			const randomQuestion = ticket.questions[randomIndex];
			if (!randomQuestion?.answers.length) {
				continue;
			}
			tickets.push({ ...randomQuestion, ticketId });
			i++;
		}
		return tickets;
	},

	async sendExamResult(data: {
		userId: string;
		ticketId: string;
		questionId: string;
		answerId: string;
	}) {
		const { userId, ticketId, questionId, answerId } = data;

		const user = await isUserExist(userId);
		const question = await isQuestionExist(ticketId, questionId);
		const correctAnswerId =
			question.answers.find((answer) => answer.isCorrect)?.answerId || "";
		const isCorrect = correctAnswerId === answerId;

		let examResult = user.results.exam;

		if (!examResult) examResult = [];
		examResult.push({ ticketId, questionId, answerId, isCorrect });
		const update = {
			$set: {
				"results.exam": examResult,
			},
		};

		await userCollection.updateOne({ id: userId }, update, { upsert: true });

		return { help: question.help, correctAnswerId, isCorrect };
	},
};
