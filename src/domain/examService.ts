import { examRepository } from "../repositories/examRepository";
import type { TypeQuestion } from "../types";
import fs from "node:fs";

const imageToBase64 = (imagePath: string) => {
	const image = fs.readFileSync(imagePath, { encoding: "base64" });
	return image;
};
const removeCorrectAnswersFromTicket = (ticket: TypeQuestion[]) => {
	return ticket.map((question) => {
		return {
			question: question.question,
			img: question.img
				? `data:image/jpeg;base64,${imageToBase64(question.img)}`
				: "",
			answers: question.answers.map((answer) => answer.text),
		};
	});
};

export const examService = {
	async sendExam(userId: string) {
		const exam = await examRepository.sendExam(userId);
		const questionsWithoutAnswers = removeCorrectAnswersFromTicket(exam);
		const questionsWithTicketNumber = questionsWithoutAnswers.map(
			(question, i) => {
				return { ...question, ticketNumber: exam[i].ticketNumber };
			},
		);
		return questionsWithTicketNumber;
	},

	async sendExamResult(
		userId: string,
		ticketNumber: number,
		questionNumber: number,
		userAnswer: number,
	) {
		const question = await examRepository.sendExamResult(
			userId,
			ticketNumber,
			questionNumber,
			userAnswer,
		);
		const correctAnswer =
			question.answers.findIndex((question) => question.isCorrect) + 1 || -1; // Просто отрицательное число, что бы бло ясно что он не нашелся

		const isCorrect = correctAnswer === userAnswer;
		return {
			isCorrect,
			correctAnswer,
			help: isCorrect ? "" : question.help,
		};
	},
};
