import { examRepository } from "../repositories/examRepository";
import type {
	SendExamAnswer,
	SetAlwaysCompleteExam,
} from "../types/services/examService";

export const examService = {
	async sendExam(userId: string) {
		const exam = await examRepository.sendExam(userId);
		return exam;
	},

	async sendExamAnswer(data: SendExamAnswer) {
		const { userId, ticketId, questionId, answerId } = data;
		const dataFromDB = await examRepository.sendExamAnswer({
			userId,
			ticketId,
			questionId,
			answerId,
		});
		const result = {
			isCorrect: dataFromDB.isCorrect,
			correctAnswer: dataFromDB.correctAnswerId,
			help: dataFromDB.isCorrect ? "" : dataFromDB.help,
		};

		return result;
	},

	async sendTrainingExamAnswer(data: SendExamAnswer) {
		const { userId, ticketId, questionId, answerId } = data;

		const dataFromDB = await examRepository.sendTrainingExamAnswer({
			userId,
			ticketId,
			questionId,
			answerId,
		});
		const result = {
			isCorrect: dataFromDB.isCorrect,
			correctAnswer: dataFromDB.correctAnswerId,
			help: dataFromDB.isCorrect ? "" : dataFromDB.help,
		};

		return result;
	},

	async getExamResult(userId: string) {
		const examInfo = await examRepository.getExamResult(userId);
		return examInfo;
	},

	async getTrainingExamResult(userId: string) {
		const trainingExamInfo = await examRepository.getTrainingExamResult(userId);
		return trainingExamInfo;
	},

	async setAlwaysCompleteExam(data: SetAlwaysCompleteExam) {
		const { email, isAlwaysComplete } = data;
		await examRepository.setAlwaysCompleteExam({
			email,
			isAlwaysComplete,
		});
	},
};
