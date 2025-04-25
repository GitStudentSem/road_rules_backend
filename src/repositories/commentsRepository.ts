import { DBError } from "../controllers/DBError";
import type { ViewSendAllComments } from "../types/controllers/commentsController";
import type {
	DeleteComment,
	DisikeComment,
	GetAllComments,
	LikeComment,
	SendComment,
	SendReplyToComment,
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

		const likes = [];
		const dislikes = [];
		const { insertedId } = await commentsCollection.insertOne({
			...data,
			likes,
			dislikes,
			userId,
			firstName: user.firstName,
			secondName: user.secondName,
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
			likes,
			dislikes,
			...data,
		};
	},

	async sendReplyToComment(userId: string, data: SendReplyToComment) {
		const user = await isUserExist(userId);

		if (user.isBannedForChat) {
			throw new DBError(
				"Вы не можете отправлять сообщения, так как были заблокированы",
				HTTP_STATUSES.FORRIBDEN_403,
			);
		}

		// Проверяем существование корневого сообщения
		const rootMessage = await commentsCollection.findOne({
			_id: new ObjectId(data.rootMessageId),
		});
		if (!rootMessage) {
			throw new DBError(
				"Корневое сообщение не найдено",
				HTTP_STATUSES.NOT_FOUND_404,
			);
		}

		// Проверяем существование сообщения, на которое отвечаем
		const replyToMessage = await commentsCollection.findOne({
			_id: new ObjectId(data.replyToMessageId),
		});
		if (!replyToMessage) {
			throw new DBError(
				"Сообщение, на которое вы отвечаете, не найдено",
				HTTP_STATUSES.NOT_FOUND_404,
			);
		}

		// Создаем новый ответ
		const likes = [];
		const dislikes = [];
		const { insertedId } = await commentsCollection.insertOne({
			...data,
			userId,
			firstName: user.firstName,
			secondName: user.secondName,
			likes,
			dislikes,
			rootMessageId: data.rootMessageId,
			replyToMessageId: data.replyToMessageId,
			replyToUserId: replyToMessage._id.toString(),
		});

		if (!insertedId) {
			throw new DBError("Ответ не был добавлен", HTTP_STATUSES.NOT_FOUND_404);
		}

		return {
			commentId: insertedId.toHexString(),
			firstName: user.firstName,
			secondName: user.secondName,
			userId,
			likes,
			dislikes,
			time: data.time,
			ticketId: data.ticketId,
			questionId: data.questionId,
			text: data.text,
			replyInfo: {
				rootMessageId: data.rootMessageId,
				replyToMessageId: data.replyToMessageId,
				replyToUserId: replyToMessage.userId,
			},
		};
	},

	async getAllComments(userId: string, questionInfo: GetAllComments) {
		// Проверяем существование пользователя
		await isUserExist(userId);

		// Проверяем существование вопроса
		await findQuestion(questionInfo.ticketId, questionInfo.questionId);

		const rootComments = await commentsCollection
			.find({ ...questionInfo, rootMessageId: undefined })
			.toArray();

		const result: ViewSendAllComments[] = [];

		for (const rootComment of rootComments) {
			const repliesForRoot = await commentsCollection
				.find({
					rootMessageId: rootComment._id.toString(),
				})
				.toArray();

			result.push({
				ticketId: rootComment.ticketId,
				questionId: rootComment.questionId,
				commentId: rootComment._id,
				text: rootComment.text,
				firstName: rootComment.firstName,
				secondName: rootComment.secondName,
				time: rootComment.time,
				userId: rootComment.userId,
				likes: rootComment.likes,
				dislikes: rootComment.dislikes,
				replies: [
					...repliesForRoot.map((replyForRoot) => {
						return {
							ticketId: replyForRoot.ticketId,
							questionId: replyForRoot.questionId,
							commentId: replyForRoot._id,
							text: replyForRoot.text,
							firstName: replyForRoot.firstName,
							secondName: replyForRoot.secondName,
							time: replyForRoot.time,
							userId: replyForRoot.userId,
							likes: replyForRoot.likes,
							dislikes: replyForRoot.dislikes,
							replies: [],
							replyToMessageId: replyForRoot.replyToMessageId,
							replyToUserId: replyForRoot.replyToUserId,
						};
					}),
				],
			});
		}

		return result;
	},
	async deleteComment(userId: string, data: DeleteComment) {
		const user = await isUserExist(userId);

		if (!ObjectId.isValid(data.commentId)) {
			throw new DBError(
				"Неверный формат commentId",
				HTTP_STATUSES.BAD_REQUEST_400,
			);
		}

		const foundedComment = await commentsCollection.findOne({
			_id: new ObjectId(data.commentId),
		});
		if (!foundedComment) {
			throw new DBError("Комментарий не найден", HTTP_STATUSES.NOT_FOUND_404);
		}

		if (user.role === "user" && foundedComment.userId !== userId) {
			throw new DBError(
				"У вас недостаточно прав для удаления комментария",
				HTTP_STATUSES.FORRIBDEN_403,
			);
		}

		// if (foundedComment.userId !== userId) {
		// 	throw new DBError(
		// 		"Это не ваш комментарий, вы не можете его удалить",
		// 		HTTP_STATUSES.FORRIBDEN_403,
		// 	);
		// }

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

	async likeComment(userId: string, data: LikeComment) {
		const foundedComment = await commentsCollection.findOne({
			_id: new ObjectId(data.commentId),
		});
		if (!foundedComment) {
			throw new DBError("Комментарий не найден", HTTP_STATUSES.NOT_FOUND_404);
		}

		const user = await isUserExist(userId);

		const alreadyHasLike = foundedComment.likes.find((like) => {
			return like.userId === userId;
		});

		if (alreadyHasLike) {
			const updatedComment = await commentsCollection.findOneAndUpdate(
				{ _id: new ObjectId(data.commentId) },
				{ $pull: { likes: { userId } } },
				{ returnDocument: "after" },
			);

			if (!updatedComment) {
				throw new DBError("Комментарий не найден", HTTP_STATUSES.NOT_FOUND_404);
			}

			return {
				commentId: new ObjectId(data.commentId),
				likes: updatedComment.likes,
			};
		}

		const updatedComment = await commentsCollection.findOneAndUpdate(
			{ _id: new ObjectId(data.commentId) },
			{
				$addToSet: {
					likes: {
						firstName: user.firstName,
						secondName: user.secondName,
						userId,
					},
				},
			},
			{ returnDocument: "after" },
		);
		if (!updatedComment) {
			throw new DBError("Комментарий не найден", HTTP_STATUSES.NOT_FOUND_404);
		}
		return {
			commentId: new ObjectId(data.commentId),
			likes: updatedComment.likes,
		};
	},

	async dislikeComment(userId: string, data: DisikeComment) {
		const foundedComment = await commentsCollection.findOne({
			_id: new ObjectId(data.commentId),
		});
		if (!foundedComment) {
			throw new DBError("Комментарий не найден", HTTP_STATUSES.NOT_FOUND_404);
		}

		const user = await isUserExist(userId);

		const alreadyHasDislike = foundedComment.dislikes.find((dislike) => {
			return dislike.userId === userId;
		});

		if (alreadyHasDislike) {
			const updatedComment = await commentsCollection.findOneAndUpdate(
				{ _id: new ObjectId(data.commentId) },
				{ $pull: { dislikes: { userId } } },
				{ returnDocument: "after" },
			);

			if (!updatedComment) {
				throw new DBError("Комментарий не найден", HTTP_STATUSES.NOT_FOUND_404);
			}

			return {
				commentId: new ObjectId(data.commentId),
				dislikes: updatedComment.dislikes,
			};
		}

		const updatedComment = await commentsCollection.findOneAndUpdate(
			{ _id: new ObjectId(data.commentId) },
			{
				$addToSet: {
					dislikes: {
						firstName: user.firstName,
						secondName: user.secondName,
						userId,
					},
				},
			},
			{ returnDocument: "after" },
		);
		if (!updatedComment) {
			throw new DBError("Комментарий не найден", HTTP_STATUSES.NOT_FOUND_404);
		}
		return {
			commentId: new ObjectId(data.commentId),
			dislikes: updatedComment.dislikes,
		};
	},

	async getCommentsCount(ticketId: string, questionId: string) {
		const allComments = await commentsCollection
			.find({ ticketId, questionId })
			.toArray();

		return allComments.length;
	},

	async deleteAllCommentsForQuestionId(questionId: string) {
		await commentsCollection.deleteMany({ questionId });
	},

	async deleteAllCommentsForTicketId(ticketId: string) {
		await commentsCollection.deleteMany({ ticketId });
	},
};
