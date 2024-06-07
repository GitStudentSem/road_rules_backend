import sharp from "sharp";
import { editorRepository } from "../repositories/editorRepository";
import type { CreateQuestionBody } from "../models/editor/CreateQuestionBody";
import type { DeleteQuestionBody } from "../models/editor/DeleteQuestionBody";
import { colors, resetStyle } from "../assets/logStyles";

const calculateSizeInKB = (arrayBuffer: ArrayBuffer) => {
	const bytes = arrayBuffer.byteLength;
	const kilobytes = Math.round(bytes / 1024);
	return kilobytes;
};

const imageToBase64 = async (img?: ArrayBuffer) => {
	if (!img) return "";
	const sizeMB = img.byteLength / (1024 * 1024);
	console.log(
		`${colors.blue}image size before ${calculateSizeInKB(
			img,
		)} KB ${resetStyle}`,
	);

	const imageBuffer = await sharp(img).jpeg().toBuffer();

	console.log(
		`${colors.blue}image size after ${calculateSizeInKB(
			imageBuffer,
		)} KB${resetStyle}`,
	);

	const imageInBase64 = `data:image/png;base64,${imageBuffer.toString(
		"base64",
	)}`;
	return imageInBase64;
};

export const editorService = {
	async createTicket() {
		const ticketId = Number(new Date()).toString();
		await editorRepository.createTicket(ticketId);
	},

	async addQuestion(data: CreateQuestionBody) {
		const { img, ticketId, question, help, answers } = data;
		const imageInBase64 = await imageToBase64(img);
		const questionId = Number(new Date()).toString();

		const answersWithId = answers.map((answer, i) => {
			const answerId = Number(new Date()).toString() + i;
			return { answerText: answer, answerId };
		});

		await editorRepository.addQuestion({
			img: imageInBase64,
			questionId,
			ticketId,
			question,
			help,
			answers: answersWithId,
		});
	},

	async deleteTicket(ticketId: string) {
		await editorRepository.deleteTicket(ticketId);
	},
	async deleteQuestion(data: DeleteQuestionBody) {
		const { ticketId, questionId } = data;

		await editorRepository.deleteQuestion(ticketId, questionId);
	},
};
