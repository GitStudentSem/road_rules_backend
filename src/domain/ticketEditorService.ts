import sharp from "sharp";
import { ticketEditorRepository } from "../repositories/ticketEditorRepository";
import type { CreateQuestionBody } from "../models/ticketEditor/CreateQuestionBody";
import type { DeleteQuestionBody } from "../models/ticketEditor/DeleteQuestionBody";
import { colors, resetStyle, styles } from "../assets/logStyles";
import { crc32 } from "crc";
import type { EditQuestionBody } from "../models/ticketEditor/EditQuestionBody";

const calculateSizeInKB = (arrayBuffer: ArrayBuffer) => {
	const bytes = arrayBuffer.byteLength;
	const kilobytes = Math.round(bytes / 1024);
	return kilobytes;
};

const imageToBase64 = async ({
	img,
	imageInDB,
	DBImageOriginalHash,
}: {
	img?: ArrayBuffer;
	imageInDB?: string;
	DBImageOriginalHash?: string;
}) => {
	// Для сравнения контрольных сумм используй crc64
	if (!img) return { img: "", imageOriginalHash: "", imagePrcessedHash: "" };

	const imageSizeBefore = calculateSizeInKB(img);

	const processedImage = await sharp(img).jpeg().toBuffer();

	const imageOriginalHash = crc32(img).toString(16);
	const imagePrcessedHash = crc32(processedImage).toString(16);

	if (imageOriginalHash === DBImageOriginalHash) {
		return {
			img: imageInDB || "",
			imageOriginalHash,
			imagePrcessedHash,
		};
	}

	const imageSizeAfter = calculateSizeInKB(processedImage);

	const reductionPercentage = (
		((imageSizeBefore - imageSizeAfter) / imageSizeBefore) *
		100
	).toFixed(2);

	console.log(
		`${colors.blue}Размер картинки до сжатия: ${styles.bold}${imageSizeBefore} KB ${resetStyle}`,
	);

	console.log(
		`${colors.blue}Размер картинки после сжатия: ${styles.bold}${imageSizeAfter} KB${resetStyle}`,
	);

	console.log(
		`${colors.blue}Картинка была оптимизирована на ${styles.bold}${reductionPercentage}%${resetStyle}`,
	);
	console.log(`${colors.blue}======================${resetStyle}`);

	const imageInBase64 = `data:image/jpeg;base64,${processedImage.toString(
		"base64",
	)}`;
	return { img: imageInBase64, imageOriginalHash, imagePrcessedHash };
};

export const ticketEditorService = {
	async createTicket(userId: string) {
		const ticketId = Number(new Date()).toString();
		const createdAt = Number(new Date());
		await ticketEditorRepository.createTicket({ ticketId, createdAt, userId });
		return ticketId;
	},

	async getQuestionsInTicket(ticketId: string, userId: string) {
		const questions = await ticketEditorRepository.getQuestionsInTicket(
			ticketId,
			userId,
		);
		const questionData = questions.map((question) => {
			const answersWithoutId = question.answers.map((answerInfo) => {
				return {
					answerText: answerInfo.answerText,
					isCorrect: answerInfo.isCorrect,
				};
			});
			return {
				img: question.imgInfo.img,
				questionId: question.questionId,
				question: question.question,
				help: question.help,
				answers: answersWithoutId,
			};
		});
		return questionData;
	},

	async createQuestion(data: { userId: string } & CreateQuestionBody) {
		const { img, ticketId, question, help, correctAnswer, answers, userId } =
			data;
		const imageInBase64 = await imageToBase64({ img });
		const questionId = Number(new Date()).toString();

		const answersWithId = answers.map((answer, i) => {
			const answerId = Number(new Date()).toString() + i;
			return { answerText: answer, isCorrect: i === correctAnswer, answerId };
		});

		await ticketEditorRepository.createQuestion({
			imgInfo: imageInBase64,
			questionId,
			ticketId,
			question,
			help,
			answers: answersWithId,
			userId,
		});
	},

	async editQuestion(data: { userId: string } & EditQuestionBody) {
		const {
			img,
			ticketId,
			questionId,
			question,
			help,
			correctAnswer,
			answers,
			userId,
		} = data;
		const questionInfo = await ticketEditorRepository.findQuestion({
			ticketId,
			questionId,
			userId,
		});
		const { imgInfo } = questionInfo;
		const imageInBase64 = await imageToBase64({
			img,
			imageInDB: imgInfo.img,
			DBImageOriginalHash: imgInfo.imageOriginalHash,
		});

		const answersWithId = answers.map((answer, i) => {
			const answerId = Number(new Date()).toString() + i;
			return { answerText: answer, isCorrect: i === correctAnswer, answerId };
		});

		await ticketEditorRepository.editQuestion({
			imgInfo: imageInBase64,
			questionId,
			ticketId,
			question,
			help,
			answers: answersWithId,
			userId,
		});
	},

	async deleteTicket(ticketId: string, userId: string) {
		await ticketEditorRepository.deleteTicket(ticketId, userId);
	},

	async deleteQuestion(data: { userId: string } & DeleteQuestionBody) {
		const { ticketId, questionId, userId } = data;

		await ticketEditorRepository.deleteQuestion({
			ticketId,
			questionId,
			userId,
		});
	},
};
