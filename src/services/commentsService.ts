import { commentsRepository } from "../repositories/commentsRepository";
import type {
	DeleteComment,
	GetAllComments,
	SendComment,
} from "../types/services/commentsService";

export const commentsService = {
	async sendMessage(userId: string, data: SendComment) {
		return await commentsRepository.sendMessage(userId, data);
	},

	async getAllComments(filterData: GetAllComments) {
		return await commentsRepository.getAllComments(filterData);
	},

	async deletedComment(data: DeleteComment) {
		return await commentsRepository.deleteComment(data);
	},
};
