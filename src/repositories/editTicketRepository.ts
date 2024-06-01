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
export const editTicketRepository = {
	async createTicket(ticketId: string) {
		ticketCollection.insertOne({ ticketId, questions: [] });
		return true;
	},

	async addQuestion(data: CreateQuestion) {
		const { img, questionId, ticketId, question, help, answers } = data;
		const ticket = await ticketCollection.findOne({ ticketId });

		if (!ticket) {
			throw new DBError("Билет не найден", HTTP_STATUSES.BAD_REQUEST_400);
		}

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

		return true;
	},
	async deleteQuestion(questionId: string) {
		const deletedUser = await ticketCollection.deleteOne({ questionId });
		return deletedUser.deletedCount === 1;
	},
};
