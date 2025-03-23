import { DBError } from "../controllers/DBError";
import { commentsRepository } from "../repositories/commentsRepository";
import type {
	DeleteComment,
	GetAllComments,
	SendComment,
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
		return await commentsRepository.sendMessage(userId, data);
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
};
