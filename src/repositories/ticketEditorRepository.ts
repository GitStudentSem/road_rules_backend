import { DBError } from "../controllers/DBError";
import type {
	CreateQuestion,
	CreateTicket,
	DeleteQuestion,
	FindQuestion,
} from "../types/repositories/ticketEditorRepository";
import { HTTP_STATUSES } from "../utils";
import { ticketCollection, userCollection } from "./db";

const findTicket = async (ticketId: string) => {
	const ticket = await ticketCollection.findOne({ ticketId });

	if (!ticket) {
		throw new DBError("Билет не найден", HTTP_STATUSES.NOT_FOUND_404);
	}

	return ticket;
};

const isUserExist = async (userId: string) => {
	const filter = { userId };
	const user = await userCollection.findOne(filter);
	if (!user) {
		throw new DBError("Пользователь не найден", HTTP_STATUSES.NOT_FOUND_404);
	}
	return user;
};

const checkAccessByRole = async (userId: string) => {
	const user = await isUserExist(userId);

	if (user.role === "user") {
		throw new DBError("У вас нет прав доступа", HTTP_STATUSES.BAD_REQUEST_400);
	}
};

const getTicketsIds = async () => {
	const ticketsIds = await ticketCollection
		.aggregate<{ ticketId: string; createdAt: Date }>([
			// Сортируем документы по полю 'createdAt'
			{ $sort: { createdAt: 1 } },

			// Группируем по 'ticketId' и добавляем уникальные ticketId в массив
			{ $group: { _id: "$ticketId", createdAt: { $first: "$createdAt" } } },

			// Проектируем ticketId и createdAt
			{ $project: { _id: 0, ticketId: "$_id", createdAt: 1 } },

			// Финальная сортировка по полю 'createdAt'
			{ $sort: { createdAt: 1 } },
		])
		.toArray();

	const onlyTicketIds = ticketsIds.map(({ ticketId }) => ticketId);
	return onlyTicketIds;
};

export const ticketEditorRepository = {
	async sendTickets(userId: string) {
		await checkAccessByRole(userId);
		const ticketsIds = await getTicketsIds();
		return ticketsIds;
	},

	async createTicket(data: CreateTicket) {
		const { createdAt, ticketId, userId } = data;
		await checkAccessByRole(userId);
		await ticketCollection.insertOne({ createdAt, ticketId, questions: [] });
	},

	async checkMaxCountQuestions(ticketId: string) {
		const MAX_QUESTIONS_IN_TICKET = 20;
		const ticket = await findTicket(ticketId);

		if (ticket.questions.length >= MAX_QUESTIONS_IN_TICKET) {
			throw new DBError(
				`Максимальное количество вопросов в билете ${MAX_QUESTIONS_IN_TICKET}`,
				HTTP_STATUSES.BAD_REQUEST_400,
			);
		}
	},

	async createQuestion(data: CreateQuestion) {
		const { imgInfo, questionId, ticketId, question, help, answers, userId } =
			data;
		await checkAccessByRole(userId);

		await ticketCollection.updateOne(
			{ ticketId },
			{
				$push: { questions: { imgInfo, questionId, question, help, answers } },
			},
		);
	},

	async getQuestionsInTicket(ticketId: string, userId: string) {
		await checkAccessByRole(userId);

		const ticket = await findTicket(ticketId);
		return ticket.questions;
	},

	async editQuestion(data: CreateQuestion) {
		const { imgInfo, questionId, ticketId, question, help, answers, userId } =
			data;
		await checkAccessByRole(userId);

		const query = {
			ticketId: ticketId,
			"questions.questionId": questionId,
		};

		const update = {
			$set: {
				"questions.$.question": question,
				"questions.$.help": help,
				"questions.$.imgInfo": imgInfo,
				"questions.$.answers": answers,
			},
		};

		const result = await ticketCollection.updateOne(query, update);

		if (result.matchedCount > 0) {
			return;
		}
		throw new DBError(
			"Билет или вопрос не найден",
			HTTP_STATUSES.NOT_FOUND_404,
		);
	},

	async findQuestion(data: FindQuestion) {
		// Поиск документа с использованием $elemMatch
		const { ticketId, questionId, userId } = data;

		await checkAccessByRole(userId);

		const query = {
			ticketId,
			questions: {
				$elemMatch: {
					questionId,
				},
			},
		};

		const projection = {
			_id: 0,
			"questions.$": 1,
		};

		const ticket = await ticketCollection.findOne(query, {
			projection,
		});
		if (ticket?.questions && ticket.questions.length > 0) {
			return ticket.questions[0];
		}
		throw new DBError("Билет не найден", HTTP_STATUSES.NOT_FOUND_404);
	},

	async deleteTicket(ticketId: string, userId: string) {
		await checkAccessByRole(userId);

		await findTicket(ticketId);

		const result = await ticketCollection.deleteOne({ ticketId });

		if (result.deletedCount > 0) return true;

		throw new DBError("Билет не был удален", HTTP_STATUSES.BAD_REQUEST_400);
	},

	async deleteQuestion(data: DeleteQuestion) {
		const { ticketId, questionId, userId } = data;
		await checkAccessByRole(userId);

		await findTicket(ticketId);

		const query = {
			ticketId,
			questions: {
				$elemMatch: { questionId },
			},
		};

		const question = await ticketCollection.findOne(query);

		if (!question) {
			throw new DBError("Вопрос не найден", HTTP_STATUSES.NOT_FOUND_404);
		}
		const update = {
			$pull: { questions: { questionId } },
		};

		const result = await ticketCollection.updateOne({ ticketId }, update);

		if (result.modifiedCount > 0) return true;

		throw new DBError("Вопрос не был удален", HTTP_STATUSES.BAD_REQUEST_400);
	},
};
