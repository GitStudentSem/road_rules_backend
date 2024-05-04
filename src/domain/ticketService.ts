import { ticketRepository } from "../repositories/ticketRepository";
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

export const ticketService = {
	async sendTicketsCount(userId: string) {
		const ticketsCount = await ticketRepository.sendTicketsCount(userId);
		return ticketsCount;
	},

	async sendTicket(userId: string, ticketNumber: number) {
		const ticket = await ticketRepository.sendTicket(userId, ticketNumber);
		return removeCorrectAnswersFromTicket(ticket);
	},

	async sendTicketResult(
		userId: string,
		ticketNumber: number,
		questionNumber: number,
		userAnswer: number,
	) {
		const result = await ticketRepository.sendTicketResult(
			userId,
			ticketNumber,
			questionNumber,
			userAnswer,
		);
		const isCorrect = result.correctAnswer === userAnswer;
		return {
			isCorrect,
			correctAnswer: result.correctAnswer,
			help: isCorrect ? "" : result.help,
		};
	},
};
