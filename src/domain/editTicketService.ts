import sharp from "sharp";
import { editTicketRepository } from "../repositories/editTicketRepository";
import type { CreateQuestionBody } from "../modeles/editTicket/CreateQuestionBody";

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
		const isCreated = await editTicketRepository.createTicket(ticketId);

		return isCreated;
	},

	async addQuestion(data: CreateQuestionBody) {
		const { img, ticketId, question, help, answers } = data;
		const imageInBase64 = await imageToBase64(img);

		const answersWithId = answers.map((answer) => {
			const id = performance.now().toString();
			return { answerText: answer, id };
		});

		const isCreated = await editTicketRepository.addQuestion({
			img: imageInBase64,
			ticketId,
			question,
			help,
			answers: answersWithId,
		});

		return isCreated;
	},
};
