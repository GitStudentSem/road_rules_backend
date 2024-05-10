import { examRepository } from "../repositories/examRepository";
import type { TypeAnswers, TypeQuestion } from "../types";
import fs from "node:fs";

const imageToBase64 = (imagePath: string) => {
	const image = fs.readFileSync(imagePath, { encoding: "base64" });
	return image;
};

const shuffleAnswers = (answers: TypeAnswers[]) => {
	return answers.sort(() => Math.random() - 0.5);
};

const removeCorrectAnswersFromTicket = (ticket: TypeQuestion[]) => {
	return ticket.map((question) => {
		const shuffledAnswers = shuffleAnswers(question.answers);

		return {
			question: question.question,
			img: question.img
				? `data:image/jpeg;base64,${imageToBase64(question.img)}`
				: "",
			answers: shuffledAnswers.map((answer) => {
				return { answerText: answer.text, id: answer.id };
			}),
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
		answerId: string,
	) {
		const question = await examRepository.sendExamResult(
			userId,
			ticketNumber,
			questionNumber,
			answerId,
		);
		const correctAnswerId =
			question.answers.find((question) => question.isCorrect)?.id || ""; // Просто отрицательное число, что бы бло ясно что он не нашелся

		const isCorrect = correctAnswerId === answerId;
		return {
			isCorrect,
			correctAnswer: correctAnswerId,
			help: isCorrect ? "" : question.help,
		};
	},
};
