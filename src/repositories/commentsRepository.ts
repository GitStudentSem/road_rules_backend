import { DBError } from "../controllers/DBError";
import type {
	DeleteComment,
	GetAllComments,
	SendComment,
} from "../types/repositories/commentsRepository";
import { HTTP_STATUSES } from "../utils";
import { commentsCollection, ticketCollection, userCollection } from "./db";
import { ObjectId } from "mongodb";

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

		if (user.isBannedForChat) {
			throw new DBError(
				"Вы не можете отправлять сообщения, так как были заблокированы",
				HTTP_STATUSES.FORRIBDEN_403,
			);
		}

		await findQuestion(data.ticketId, data.questionId);

		const { insertedId } = await commentsCollection.insertOne({
			...data,
			userId,
		});

		if (!insertedId) {
			throw new DBError(
				"Комментарий не был добавлен",
				HTTP_STATUSES.NOT_FOUND_404,
			);
		}

		return {
			commentId: insertedId,
			firstName: user.firstName,
			secondName: user.secondName,
			userId,
			...data,
		};
	},

	async getAllComments(userId: string, questionInfo: GetAllComments) {
		const user = await isUserExist(userId);

		await findQuestion(questionInfo.ticketId, questionInfo.questionId);

		const comments = await commentsCollection.find(questionInfo).toArray();

		const formattedComments = comments.map((comment) => {
			const { _id, ...rest } = comment;
			return {
				commentId: _id,
				firstName: user.firstName,
				secondName: user.secondName,
				...rest,
			};
		});

		return formattedComments;
	},

	async deleteComment(userId: string, data: DeleteComment) {
		const user = await isUserExist(userId);

		if (!ObjectId.isValid(data.commentId)) {
			throw new DBError(
				"Неверный формат commentId",
				HTTP_STATUSES.BAD_REQUEST_400,
			);
		}

		if (user.role === "user" && user.userId !== userId) {
			throw new DBError(
				"У вас недостаточно прав для удаления комментария",
				HTTP_STATUSES.FORRIBDEN_403,
			);
		}

		const deletedComment = await commentsCollection.findOneAndDelete({
			_id: new ObjectId(data.commentId),
		});

		if (!deletedComment) {
			throw new DBError("Комментарий не найден", HTTP_STATUSES.NOT_FOUND_404);
		}

		const { _id, ...rest } = deletedComment;
		return {
			commentId: _id,
			firstName: user.firstName,
			secondName: user.secondName,
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
