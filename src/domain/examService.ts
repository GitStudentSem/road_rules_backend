import { examRepository } from "../repositories/examRepository";
import type { QuestionWithTicketId } from "../repositories/examRepository";
import type { Answer } from "../models/Answer";

const shuffleAnswers = (answers: Answer[]) => {
	return answers.sort(() => Math.random() - 0.5);
};

const removeCorrectAnswersFromTicket1 = (questions: QuestionWithTicketId[]) => {
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
		const questionWithoutCorrectAnswers = removeCorrectAnswersFromTicket1(exam);

		return questionWithoutCorrectAnswers;
	},

	async sendExamAnswer(data: {
		userId: string;
		ticketId: string;
		questionId: string;
		answerId: string;
	}) {
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

	async sendTrainingExamAnswer(data: {
		userId: string;
		ticketId: string;
		questionId: string;
		answerId: string;
	}) {
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
		const result = await examRepository.getExamResult(userId);
		return result;
	},

	async getTrainingExamResult(userId: string) {
		const result = await examRepository.getTrainingExamResult(userId);
		return result;
	},
};
