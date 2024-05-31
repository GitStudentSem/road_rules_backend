import { DBError } from "../controllers/DBError";
import { addQuestion } from "../controllers/editTicket";
import type { CreateQuestionDBModel } from "../modeles/editTicket/CreateQuestionDBModel.ts";
import { HTTP_STATUSES } from "../utils";
import { ticketCollection } from "./db";

export const editTicketRepository = {
	async createTicket(ticketId: string) {
		ticketCollection.insertOne({ ticketId, questions: [] });
		return true;
	},

	async addQuestion(data: CreateQuestionDBModel) {
		const { ticketId } = data;
		const ticket = await ticketCollection.findOne({ ticketId });

		if (ticket?.questions && ticket.questions.length >= 20) {
			throw new DBError(
				"Максимальное количество вопросов в балете 20",
				HTTP_STATUSES.BAD_REQUEST_400,
			);
		}
		await ticketCollection.updateOne(
			{ ticketId },
			{ $push: { questions: data } },
		);

		return true;
	},
};
