import { DBError } from "../controllers/DBError";
import type {
	GetAllComments,
	SendComment,
} from "../types/repositories/commentsRepository";
import { HTTP_STATUSES } from "../utils";
import { commentsCollection, ticketCollection, userCollection } from "./db";

const isUserExist = async (userId: string) => {
	const user = await userCollection.findOne({ userId });

	if (!user) {
		throw new DBError("Пользователь не найден", HTTP_STATUSES.NOT_FOUND_404);
	}
	return user;
};

const findTicket = async (ticketId: string) => {
	const ticket = await ticketCollection.findOne({ ticketId });

	if (!ticket) {
		throw new DBError("Билет не найден", HTTP_STATUSES.NOT_FOUND_404);
	}

	return ticket;
};

const findQuestion = async (ticketId: string, questionId: string) => {
	const ticket = await findTicket(ticketId);
	const question = ticket.questions.find(
		(question) => question.questionId === questionId,
	);

	if (!question) {
		throw new DBError("Вопрос не найден", HTTP_STATUSES.NOT_FOUND_404);
	}
};

export const commentsRepository = {
	async sendMessage(userId: string, data: SendComment) {
		const user = await isUserExist(userId);

		await findQuestion(data.ticketId, data.questionId);

		const { insertedId } = await commentsCollection.insertOne({
			...data,
			firstName: user.firstName,
			secondName: user.secondName,
		});
		const savedMessage = await commentsCollection.findOne(insertedId, {
			projection: { _id: 0 },
		});

		if (!savedMessage) {
			throw new DBError("Вопрос не найден", HTTP_STATUSES.NOT_FOUND_404);
		}

		return savedMessage;
	},

	async getAllComments(questionInfo: GetAllComments) {
		await findQuestion(questionInfo.ticketId, questionInfo.questionId);

		return await commentsCollection
			.find(questionInfo, {
				projection: { _id: 0 },
			})
			.toArray();
	},
};
