import { commentsRepository } from "../repositories/commentsRepository";
import type {
	DeleteComment,
	GetAllComments,
	SendComment,
} from "../types/services/commentsService";

export const commentsService = {
	async sendComment(userId: string, data: SendComment) {
		return await commentsRepository.sendMessage(userId, data);
	},

	async getAllComments(userId: string, filterData: GetAllComments) {
		return await commentsRepository.getAllComments(userId, filterData);
	},

	async deletedComment(userId: string, data: DeleteComment) {
		return await commentsRepository.deleteComment(userId, data);
	},
};
