import { DBError } from "../controllers/DBError";
import type { Answer } from "../models/Answer";
import { HTTP_STATUSES } from "../utils";
import { ticketCollection, userCollection } from "./db";

type CreateQuestion = {
	imgInfo: {
		img: string;
		imageOriginalHash: string;
		imagePrcessedHash: string;
	};
	questionId: string;
	ticketId: string;
	question: string;
	help: string;
	answers: Answer[];
	userId: string;
};

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

const checkAccessByRole = (role: string) => {
	if (role === "user") {
		throw new DBError(
			"У вас нет прав доступа, для смены роли",
			HTTP_STATUSES.BAD_REQUEST_400,
		);
	}
};

export const ticketEditorRepository = {
	async createTicket(data: {
		ticketId: string;
		createdAt: number;
		userId: string;
	}) {
		const { createdAt, ticketId, userId } = data;
		const user = await isUserExist(userId);
		checkAccessByRole(user.role);
		await ticketCollection.insertOne({ createdAt, ticketId, questions: [] });
	},

	async addQuestion(data: CreateQuestion) {
		const { imgInfo, questionId, ticketId, question, help, answers, userId } =
			data;
		const user = await isUserExist(userId);
		checkAccessByRole(user.role);

		const ticket = await findTicket(ticketId);

		if (ticket.questions.length >= 20) {
			throw new DBError(
				"Максимальное количество вопросов в балете 20",
				HTTP_STATUSES.BAD_REQUEST_400,
			);
		}

		await ticketCollection.updateOne(
			{ ticketId },
			{
				$push: { questions: { imgInfo, questionId, question, help, answers } },
			},
		);
	},
	async getQuestionsInTicket(ticketId: string, userId: string) {
		const user = await isUserExist(userId);
		checkAccessByRole(user.role);

		const ticket = await findTicket(ticketId);
		return ticket.questions;
	},

	async editQuestion(data: CreateQuestion) {
		const { imgInfo, questionId, ticketId, question, help, answers, userId } =
			data;
		const user = await isUserExist(userId);
		checkAccessByRole(user.role);

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

	async findQuestion(data: {
		ticketId: string;
		questionId: string;
		userId: string;
	}) {
		// Поиск документа с использованием $elemMatch
		const { ticketId, questionId, userId } = data;

		const user = await isUserExist(userId);
		checkAccessByRole(user.role);

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
		const user = await isUserExist(userId);
		checkAccessByRole(user.role);

		await findTicket(ticketId);

		await ticketCollection.deleteOne({ ticketId });
	},

	async deleteQuestion(data: {
		ticketId: string;
		questionId: string;
		userId: string;
	}) {
		const { ticketId, questionId, userId } = data;
		const user = await isUserExist(userId);
		checkAccessByRole(user.role);

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

		await ticketCollection.updateOne({ ticketId }, update);
	},
};
