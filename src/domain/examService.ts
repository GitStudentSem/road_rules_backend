import type { WithId } from "mongodb";
import { examRepository } from "../repositories/examRepository";
import type { QuestionWithTicketId } from "../repositories/examRepository";
import type { TypeAnswers, TypeQuestion } from "../types";
import fs from "node:fs";
import type { TicketsDBModel } from "../models/editor/TicketsDBModel";
import type { CreateQuestionDBModel } from "../models/editor/CreateQuestionDBModel";
import type { Answer } from "../models/Question";
import { header } from "express-validator";

const imageToBase64 = (imagePath: string) => {
	const image = fs.readFileSync(imagePath, { encoding: "base64" });
	return image;
};

const shuffleAnswers = (answers: Answer[]) => {
	console.log("answers", answers);
	return answers.sort(() => Math.random() - 0.5);
};

const removeCorrectAnswersFromTicket1 = (questions: QuestionWithTicketId[]) => {
	console.log("questions", questions[0].answers);
	return questions.map((question) => {
		return {
			question: question.question,
			img: question.img
				? `data:image/jpeg;base64,${imageToBase64(question.img)}`
				: "",
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

	async sendExamResult(data: {
		userId: string;
		ticketId: string;
		questionId: string;
		answerId: string;
	}) {
		const { userId, ticketId, questionId, answerId } = data;
		const dataFromDB = await examRepository.sendExamResult({
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
};
