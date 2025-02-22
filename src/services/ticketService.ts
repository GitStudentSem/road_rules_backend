import { ticketRepository } from "../repositories/ticketRepository";
import type { WithId } from "mongodb";
import type { SendTicketResult } from "../types/services/ticketsSevice";
import type { TicketsDBModel } from "../types/DBModels";
import type { ViewSendTicket } from "../types/controllers/ticketsController";

const removeCorrectAnswersFromTicket = (
	ticket: WithId<TicketsDBModel>,
): ViewSendTicket[] => {
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

	async sendTicketResult(data: SendTicketResult) {
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

	async sendFailedQuestions(userId: string) {
		const questionsInfo = await ticketRepository.sendFailedQuestions({
			userId,
		});

		const questions: ViewSendTicket[] = [];

		for (const questionInfo of questionsInfo) {
			const question = await ticketRepository.getQuestionInTicket({
				ticketId: questionInfo.result.ticketId,
				questionId: questionInfo.result.questionId,
			});

			if (!question) continue;

			questions.push({
				question: question.question,
				img: question.imgInfo.img,
				ticketId: questionInfo.result.ticketId,
				questionId: question.questionId,
				answers: question.answers.map((answer) => {
					return { answerText: answer.answerText, answerId: answer.answerId };
				}),
			});
		}
		return questions;
	},
};
