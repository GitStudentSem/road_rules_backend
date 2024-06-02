import sharp from "sharp";
import { editTicketRepository } from "../repositories/editTicketRepository";
import type { CreateQuestionBody } from "../models/editTicket/CreateQuestionBody";
import type { DeleteQuestionBody } from "../models/editTicket/DeleteQuestionBody";

const imageToBase64 = async (img?: ArrayBuffer) => {
	if (!img) return "";
	const imageBuffer = await sharp(img).jpeg().toBuffer();

	const imageInBase64 = `data:image/png;base64,${imageBuffer.toString(
		"base64",
	)}`;
	return imageInBase64;
};

export const editTicketService = {
	async createTicket() {
		const ticketId = Number(new Date()).toString();
		await editTicketRepository.createTicket(ticketId);
	},

	async addQuestion(data: CreateQuestionBody) {
		const { img, ticketId, question, help, answers } = data;
		const imageInBase64 = await imageToBase64(img);
		const questionId = Number(new Date()).toString();

		const answersWithId = answers.map((answer) => {
			const id = performance.now().toString();
			return { answerText: answer, id };
		});

		await editTicketRepository.addQuestion({
			img: imageInBase64,
			questionId,
			ticketId,
			question,
			help,
			answers: answersWithId,
		});
	},

	async deleteTicket(ticketId: string) {
		await editTicketRepository.deleteTicket(ticketId);
	},
	async deleteQuestion(data: DeleteQuestionBody) {
		const { ticketId, questionId } = data;

		await editTicketRepository.deleteQuestion(ticketId, questionId);
	},
};
