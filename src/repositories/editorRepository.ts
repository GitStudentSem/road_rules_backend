import { DBError } from "../controllers/DBError";
import type { Answer } from "../models/Answer";
import { HTTP_STATUSES } from "../utils";
import { ticketCollection } from "./db";

type CreateQuestion = {
	imgInfo: { img: string; hash: string };
	questionId: string;
	ticketId: string;
	question: string;
	help: string;
	answers: Answer[];
};

const findTicket = async (ticketId: string) => {
	const ticket = await ticketCollection.findOne({ ticketId });

	if (!ticket) {
		throw new DBError("Билет не найден", HTTP_STATUSES.NOT_FOUND_404);
	}

	return ticket;
};

export const editorRepository = {
	async createTicket(ticketId: string, createdAt: number) {
		await ticketCollection.insertOne({ createdAt, ticketId, questions: [] });
	},

	async addQuestion(data: CreateQuestion) {
		const { imgInfo, questionId, ticketId, question, help, answers } = data;
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
	async editQuestion(data: CreateQuestion) {
		const { imgInfo, questionId, ticketId, question, help, answers } = data;
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
