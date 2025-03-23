import { DBError } from "../controllers/DBError";
import type {
	DeleteComment,
	GetAllComments,
	SendComment,
} from "../types/repositories/commentsRepository";
import { HTTP_STATUSES } from "../utils";
import { commentsCollection, ticketCollection, userCollection } from "./db";
import { Db, ObjectId } from "mongodb";

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
		const savedMessage = await commentsCollection.findOne(insertedId);

		if (!savedMessage) {
			throw new DBError("Вопрос не найден", HTTP_STATUSES.NOT_FOUND_404);
		}

		const { _id, ...rest } = savedMessage;
		return {
			commentId: _id,
			...rest,
		};
	},

	async getAllComments(questionInfo: GetAllComments) {
		await findQuestion(questionInfo.ticketId, questionInfo.questionId);

		const comments = await commentsCollection.find(questionInfo).toArray();

		const formattedComments = comments.map((comment) => {
			const { _id, ...rest } = comment;
			return {
				commentId: _id,
				...rest,
			};
		});

		return formattedComments;
	},

	async deleteComment(data: DeleteComment) {
		const deletedComment = await commentsCollection.findOneAndDelete({
			_id: new ObjectId(data.commentId),
		});

		if (!deletedComment) {
			throw new DBError("Комментарий не найден", HTTP_STATUSES.NOT_FOUND_404);
		}

		const { _id, ...rest } = deletedComment;
		return {
			commentId: _id,
			...rest,
		};
	},

	async deleteAllCommentsForQuestionId(questionId: string) {
		await commentsCollection.deleteMany({ questionId });
	},

	async deleteAllCommentsForTicketId(ticketId: string) {
		await commentsCollection.deleteMany({ ticketId });
	},
};
