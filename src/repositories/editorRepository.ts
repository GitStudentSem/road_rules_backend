import { DBError } from "../controllers/DBError";
import type { Question } from "../models/Question";
import { HTTP_STATUSES } from "../utils";
import { ticketCollection } from "./db";

type CreateQuestion = {
	img: string;
	questionId: string;
	ticketId: string;
	question: string;
	help: string;
	answers: Question[];
};

const findTicket = async (ticketId: string) => {
	const ticket = await ticketCollection.findOne({ ticketId });

	if (!ticket) {
		throw new DBError("Билет не найден", HTTP_STATUSES.NOT_FOUND_404);
	}

	return ticket;
};

export const editorRepository = {
	async createTicket(ticketId: string) {
		await ticketCollection.insertOne({ ticketId, questions: [] });
	},

	async addQuestion(data: CreateQuestion) {
		const { img, questionId, ticketId, question, help, answers } = data;
		const ticket = await findTicket(ticketId);

		if (ticket.questions.length >= 20) {
			throw new DBError(
				"Максимальное количество вопросов в балете 20",
				HTTP_STATUSES.BAD_REQUEST_400,
			);
		}

		await ticketCollection.updateOne(
			{ ticketId },
			{ $push: { questions: { img, questionId, question, help, answers } } },
		);
	},

	async deleteTicket(ticketId: string) {
		await findTicket(ticketId);

		await ticketCollection.deleteOne({ ticketId });
	},

	async deleteQuestion(ticketId: string, questionId: string) {
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
