import type { CreateQuestionDBModel } from "../models/ticketEditor/CreateQuestionDBModel";
import { questionRepository } from "../repositories/questionRepository";

const removeUnusedInfoFromQuestion = (question: CreateQuestionDBModel) => {
	return {
		question: question.question,
		img: question.imgInfo.img,
		questionId: question.questionId,
		help: question.help,
		answers: question.answers,
	};
};

export const questionService = {
	async sendQuestion(data: {
		ticketId: string;
		questionId: string;

		userId: string;
	}) {
		const question = await questionRepository.sendQuestion({
			ticketId: data.ticketId,
			questionId: data.questionId,
			userId: data.userId,
		});
		const questionWithoutOtherData = removeUnusedInfoFromQuestion(question);
		return questionWithoutOtherData;
	},
};
