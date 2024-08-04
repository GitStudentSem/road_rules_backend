import { examRepository } from "../repositories/examRepository";
import type {
	SendExamAnswer,
	SetAlwaysCompleteExam,
	QuestionWithTicketId,
	Answer,
} from "../types/services/examService";

const shuffleAnswers = (answers: Answer[]) => {
	return answers.sort(() => Math.random() - 0.5);
};

const removeCorrectAnswersFromTicket = (questions: QuestionWithTicketId[]) => {
	return questions.map((question) => {
		return {
			question: question.question,
			img: question.imgInfo.img,
			questionId: question.questionId,
			ticketId: question.ticketId,
			answers: shuffleAnswers(question.answers).map((answer) => {
				return { answerText: answer.answerText, answerId: answer.answerId };
			}),
		};
	});
};

export const examService = {
	async sendExam(userId: string) {
		const exam = await examRepository.sendExam(userId);
		const questionWithoutCorrectAnswers = removeCorrectAnswersFromTicket(exam);

		return questionWithoutCorrectAnswers;
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
