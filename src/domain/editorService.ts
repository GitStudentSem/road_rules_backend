import sharp from "sharp";
import { editorRepository } from "../repositories/editorRepository";
import type { CreateQuestionBody } from "../models/editor/CreateQuestionBody";
import type { DeleteQuestionBody } from "../models/editor/DeleteQuestionBody";
import { colors, resetStyle, styles } from "../assets/logStyles";

const calculateSizeInKB = (arrayBuffer: ArrayBuffer) => {
	const bytes = arrayBuffer.byteLength;
	const kilobytes = Math.round(bytes / 1024);
	return kilobytes;
};

const imageToBase64 = async (img?: ArrayBuffer) => {
	// Для сравнения контрольных сумм используй crc64
	if (!img) return "";

	const imageSizeBefore = calculateSizeInKB(img);
	console.log(
		`${colors.blue}Размер картинки до сжатия: ${styles.bold}${imageSizeBefore} KB ${resetStyle}`,
	);

	const imageBuffer = await sharp(img).jpeg().toBuffer();

	const imageSizeAfter = calculateSizeInKB(imageBuffer);
	console.log(
		`${colors.blue}Размер картинки после сжатия: ${styles.bold}${imageSizeAfter} KB${resetStyle}`,
	);

	const reductionPercentage = (
		((imageSizeBefore - imageSizeAfter) / imageSizeBefore) *
		100
	).toFixed(2);

	console.log(
		`${colors.blue}Картинка была оптимизирована на ${styles.bold}${reductionPercentage}%${resetStyle}`,
	);
	console.log(`${colors.blue}======================${resetStyle}`);

	const imageInBase64 = `data:image/png;base64,${imageBuffer.toString(
		"base64",
	)}`;
	return imageInBase64;
};

export const editorService = {
	async createTicket() {
		const ticketId = Number(new Date()).toString();
		const createdAt = Number(new Date());
		await editorRepository.createTicket(ticketId, createdAt);
	},

	async addQuestion(data: CreateQuestionBody) {
		const { img, ticketId, question, help, correctAnswer, answers } = data;
		const imageInBase64 = await imageToBase64(img);
		const questionId = Number(new Date()).toString();

		const answersWithId = answers.map((answer, i) => {
			const answerId = Number(new Date()).toString() + i;
			return { answerText: answer, isCorrect: i === correctAnswer, answerId };
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
	async editQuestion(data: CreateQuestionBody) {
		const { img, ticketId, question, help, correctAnswer, answers } = data;
		const imageInBase64 = await imageToBase64(img);
		const questionId = Number(new Date()).toString();

		const answersWithId = answers.map((answer, i) => {
			const answerId = Number(new Date()).toString() + i;
			return { answerText: answer, isCorrect: i === correctAnswer, answerId };
		});

		await editorRepository.editQuestion({
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
