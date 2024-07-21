import { ticketRepository } from "../repositories/ticketRepository";
import type { WithId } from "mongodb";
import type { TicketsDBModel } from "../models/ticketEditor/TicketsDBModel";

const removeCorrectAnswersFromTicket = (ticket: WithId<TicketsDBModel>) => {
	return ticket.questions.map((question) => {
		return {
			question: question.question,
			img: question.imgInfo.img,
			ticketId: ticket.ticketId,
			questionId: question.questionId,
			answers: question.answers.map((answer) => {
				return { answerText: answer.answerText, answerId: answer.answerId };
			}),
		};
	});
};

export const ticketService = {
	async sendTickets(userId: string) {
		const ticketsIds = await ticketRepository.sendTickets(userId);

		return ticketsIds;
	},

	async sendTicket(userId: string, ticketId: string) {
		const ticket = await ticketRepository.sendTicket(userId, ticketId);

		return removeCorrectAnswersFromTicket({
			...ticket,
			ticketId: ticket.ticketId,
		});
	},

	async sendTicketResult(data: {
		userId: string;
		ticketId: string;
		questionId: string;
		answerId: string;
	}) {
		const foundedQuestion = await ticketRepository.sendTicketResult(data);
		const correctAnswerId =
			foundedQuestion.answers.find((answer) => answer.isCorrect)?.answerId ||
			"";
		const isCorrect = correctAnswerId === data.answerId;

		return {
			isCorrect: isCorrect,
			correctAnswer: correctAnswerId,
			help: isCorrect ? "" : foundedQuestion.help,
		};
	},
};
