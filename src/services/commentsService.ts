import { commentsRepository } from "../repositories/commentsRepository";
import type {
	GetAllComments,
	SendComment,
} from "../types/services/commentsService";

export const commentsService = {
	async sendMessage(userId: string, data: SendComment) {
		return await commentsRepository.sendMessage(userId, data);
	},

	async getAllComments(filterData: GetAllComments) {
		try {
			return await commentsRepository.getAllComments(filterData);
		} catch (error) {
			throw new Error("Failed to fetch messages");
		}
	},
};
