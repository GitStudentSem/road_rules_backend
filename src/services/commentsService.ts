import { DBError } from "../controllers/DBError";
import { commentsRepository } from "../repositories/commentsRepository";
import type {
	DeleteComment,
	DislikeComment,
	GetAllComments,
	LikeComment,
	SendComment,
	SendReplyToComment,
} from "../types/services/commentsService";
import { HTTP_STATUSES } from "../utils";

export const commentsService = {
	async sendComment(userId: string, data: SendComment) {
		if (data.text.trim() === "") {
			throw new DBError(
				"Комментарий не должен быть пустым",
				HTTP_STATUSES.BAD_REQUEST_400,
			);
		}

		const time = new Date().toISOString();

		return await commentsRepository.sendMessage(userId, {
			...data,
			time,
		});
	},

	async sendReplyToComment(userId: string, data: SendReplyToComment) {
		if (data.text.trim() === "") {
			throw new DBError(
				"Комментарий не должен быть пустым",
				HTTP_STATUSES.BAD_REQUEST_400,
			);
		}

		const time = new Date().toISOString();

		return await commentsRepository.sendReplyToComment(userId, {
			...data,
			time,
		});
	},

	async getAllComments(userId: string, filterData: GetAllComments) {
		return await commentsRepository.getAllComments(userId, filterData);
	},

	async deletedComment(userId: string, data: DeleteComment) {
		if (data.commentId.trim() === "") {
			throw new DBError(
				"ID клмментария не должно быть пустым",
				HTTP_STATUSES.BAD_REQUEST_400,
			);
		}
		return await commentsRepository.deleteComment(userId, data);
	},

	async likeComment(userId: string, data: LikeComment) {
		if (data.commentId.trim() === "") {
			throw new DBError(
				"ID клмментария не должно быть пустым",
				HTTP_STATUSES.BAD_REQUEST_400,
			);
		}
		return await commentsRepository.likeComment(userId, data);
	},

	async dislikeComment(userId: string, data: DislikeComment) {
		if (data.commentId.trim() === "") {
			throw new DBError(
				"ID клмментария не должно быть пустым",
				HTTP_STATUSES.BAD_REQUEST_400,
			);
		}
		return await commentsRepository.dislikeComment(userId, data);
	},

	async getCommentsCount(ticketId: string, questionId: string) {
		const commentsCount = commentsRepository.getCommentsCount(
			ticketId,
			questionId,
		);

		return commentsCount;
	},
};
