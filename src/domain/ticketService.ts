import fs from "node:fs";
import { ticketRepository } from "../repositories/ticketRepository";
import type { TypeQuestion } from "../types";

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
			answers: question.answers.map((answer) => {
				return { answerText: answer.text, answerId: answer.id };
			}),
		};
	});
};

export const ticketService = {
	async sendTickets(userId: string) {
		const tickets = await ticketRepository.sendTickets(userId);
		const ticketsWithOnlyId = tickets.map((ticket) => {
			return { ticketId: ticket.ticketId };
		});
		return ticketsWithOnlyId;
	},

	async sendTicket(userId: string, ticketNumber: number) {
		const ticket = await ticketRepository.sendTicket(userId, ticketNumber);
		return removeCorrectAnswersFromTicket(ticket);
	},

	async sendTicketResult(
		userId: string,
		ticketNumber: number,
		questionNumber: number,
		answerId: string,
	) {
		const result = await ticketRepository.sendTicketResult(
			userId,
			ticketNumber,
			questionNumber,
			answerId,
		);

		return {
			isCorrect: result.isCorrect,
			correctAnswer: result.correctAnswer,
			help: result.isCorrect ? "" : result.help,
		};
	},
};
