import type { Socket } from "socket.io";
import { commentsService } from "../services/commentsService";
import { DBError } from "../controllers/DBError";
import type {
	BodyCommentsCount,
	BodyDeleteComment,
	BodyDislikeComment,
	BodyLikeComment,
	BodySendAllComments,
	BodySendComment,
	BodySendReplyToComment,
	ViewCommentsCount,
	ViewDeleteComment,
	ViewDislikeComment,
	ViewLikeComment,
	ViewSendAllComments,
	ViewSendComment,
	ViewSendReplyToComment,
} from "../types/controllers/commentsController";
import { Events } from "../routes/comments";
import { commentsNamespace } from "..";
import type { ErrorType, RequestWithBody } from "../types";
import type { Request, Response } from "express";
import { sendError } from "../assets/requestAssets";

const catchError = (socket: Socket, error: unknown) => {
	if (error instanceof DBError) {
		socket.emit(Events.error, {
			message: error.message,
			status: error.status,
		});
		return;
	}

	if (error instanceof Error) {
		console.log(error);
		socket.emit(Events.error, {
			message: error.message,
			status: 500,
		});
		return;
	}
};

export const commentsController = {
	async sendComment(socket: Socket, userId: string, data: BodySendComment) {
		try {
			const savedComment: ViewSendComment = await commentsService.sendComment(
				userId,
				data,
			);
			commentsNamespace
				.to(socket.currentRoom)
				.emit(Events.send_comment, savedComment);
		} catch (error) {
			catchError(socket, error);
		}
	},

	async sendReplyToComment(
		socket: Socket,
		userId: string,
		data: BodySendReplyToComment,
	) {
		try {
			const savedComment: ViewSendReplyToComment =
				await commentsService.sendReplyToComment(userId, data);
			commentsNamespace
				.to(socket.currentRoom)
				.emit(Events.send_reply_for_comment, savedComment);
		} catch (error) {
			catchError(socket, error);
		}
	},

	async getAllComments(
		socket: Socket,
		userId: string,
		data: BodySendAllComments,
	) {
		try {
			const comments: ViewSendAllComments[] =
				await commentsService.getAllComments(userId, data);
			commentsNamespace
				.to(socket.currentRoom)
				.emit(Events.get_all_comments, comments);
		} catch (error) {
			catchError(socket, error);
		}
	},

	async deleteComment(socket: Socket, userId: string, data: BodyDeleteComment) {
		try {
			const deletedComment: ViewDeleteComment =
				await commentsService.deletedComment(userId, data);
			commentsNamespace
				.to(socket.currentRoom)
				.emit(Events.delete_comment, deletedComment);
		} catch (error) {
			catchError(socket, error);
		}
	},

	async likeComment(socket: Socket, userId: string, data: BodyLikeComment) {
		try {
			const reactedComment: ViewLikeComment = await commentsService.likeComment(
				userId,
				data,
			);

			commentsNamespace
				.to(socket.currentRoom)
				.emit(Events.like_comment, reactedComment);
		} catch (error) {
			catchError(socket, error);
		}
	},

	async dislikeComment(
		socket: Socket,
		userId: string,
		data: BodyDislikeComment,
	) {
		try {
			const reactedComment: ViewDislikeComment =
				await commentsService.dislikeComment(userId, data);

			commentsNamespace
				.to(socket.currentRoom)
				.emit(Events.dislike_comment, reactedComment);
		} catch (error) {
			catchError(socket, error);
		}
	},

	async getCommentsCount(
		req: RequestWithBody<BodyCommentsCount>,
		res: Response<ViewCommentsCount | ErrorType>,
	) {
		try {
			const commentsCount = await commentsService.getCommentsCount(
				req.body.ticketId,
				req.body.questionId,
			);
			res.json({ count: commentsCount });
			return commentsCount;
		} catch (error) {
			if (error instanceof DBError) {
				res.status(error.status).json({ message: error.message });
				return;
			}
			sendError({
				message: "Не удалось получить количество комментариев",
				error,
				res,
				req,
			});
		}
	},
};
