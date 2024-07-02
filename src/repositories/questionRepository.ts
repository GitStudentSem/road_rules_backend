import { DBError } from "../controllers/DBError";
import { HTTP_STATUSES } from "../utils";
import { ticketCollection, userCollection } from "./db";

const isUserExist = async (userId: string) => {
	const filter = { userId };
	const user = await userCollection.findOne(filter);
	if (!user) {
		throw new DBError("Пользователь не найден", HTTP_STATUSES.NOT_FOUND_404);
	}
	return user;
};

const isTicketExist = async (ticketId: string) => {
	const ticket = await ticketCollection.findOne({ ticketId });
	if (!ticket) {
		throw new DBError("Билет не найден", HTTP_STATUSES.NOT_FOUND_404);
	}

	return ticket;
};

export const questionRepository = {
	async sendQuestion(data: {
		ticketId: string;
		questionId: string;
		userId: string;
	}) {
		const { ticketId, questionId, userId } = data;
		await isUserExist(userId);
		const ticket = await isTicketExist(ticketId);
		const question = ticket.questions.find(
			(question) => question.questionId === questionId,
		);
		if (!question)
			throw new DBError(
				"Указанный вопрос не найден",
				HTTP_STATUSES.NOT_FOUND_404,
			);
		return question;
	},
};
