import type { Socket } from "socket.io";
import { commentsService } from "../services/commentsService";
import { DBError } from "../controllers/DBError";
import type {
	BodyDeleteComment,
	BodySendAllComments,
	BodySendComment,
	ViewDeleteComment,
	ViewSendAllComments,
	ViewSendComment,
} from "../types/controllers/commentsController";
import { Events } from "../routes/comments";
import { commentsNamespace } from "..";

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
			commentsNamespace.emit(Events.send_comment, savedComment);
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
			socket.emit(Events.get_all_comments, comments);
		} catch (error) {
			catchError(socket, error);
		}
	},

	async deleteComment(socket: Socket, userId: string, data: BodyDeleteComment) {
		try {
			const deletedComment: ViewDeleteComment =
				await commentsService.deletedComment(userId, data);
			socket.emit(Events.delete_comment, deletedComment);
		} catch (error) {
			catchError(socket, error);
		}
	},
};
