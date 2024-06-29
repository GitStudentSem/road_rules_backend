import sharp from "sharp";
import { editorRepository } from "../repositories/editorRepository";
import type { CreateQuestionBody } from "../models/editor/CreateQuestionBody";
import type { DeleteQuestionBody } from "../models/editor/DeleteQuestionBody";
import { colors, resetStyle, styles } from "../assets/logStyles";
import { crc32 } from "crc";
import type { EditQuestionBody } from "../models/editor/EditQuestionBody";

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

export const editorService = {
	async createTicket() {
		const ticketId = Number(new Date()).toString();
		const createdAt = Number(new Date());
		await editorRepository.createTicket(ticketId, createdAt);
		return ticketId;
	},

	async addQuestion(data: CreateQuestionBody) {
		const { img, ticketId, question, help, correctAnswer, answers } = data;
		const imageInBase64 = await imageToBase64({ img });
		const questionId = Number(new Date()).toString();

		const answersWithId = answers.map((answer, i) => {
			const answerId = Number(new Date()).toString() + i;
			return { answerText: answer, isCorrect: i === correctAnswer, answerId };
		});

		await editorRepository.addQuestion({
			imgInfo: imageInBase64,
			questionId,
			ticketId,
			question,
			help,
			answers: answersWithId,
		});
	},

	async editQuestion(data: EditQuestionBody) {
		const {
			img,
			ticketId,
			questionId,
			question,
			help,
			correctAnswer,
			answers,
		} = data;
		const questionInfo = await editorRepository.findQuestion(
			ticketId,
			questionId,
		);
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

		await editorRepository.editQuestion({
			imgInfo: imageInBase64,
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
