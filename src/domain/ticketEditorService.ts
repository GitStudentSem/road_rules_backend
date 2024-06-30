import sharp from "sharp";
import { ticketEditorRepository } from "../repositories/ticketEditorRepository";
import type { CreateQuestionBody } from "../models/ticketEditor/CreateQuestionBody";
import type { DeleteQuestionBody } from "../models/ticketEditor/DeleteQuestionBody";
import { colors, resetStyle, styles } from "../assets/logStyles";
import { crc32 } from "crc";
import type { EditQuestionBody } from "../models/ticketEditor/EditQuestionBody";
import { DBError } from "../controllers/DBError";
import { HTTP_STATUSES } from "../utils";
import AWS from "aws-sdk";

const calculateSizeInKB = (arrayBuffer: ArrayBuffer) => {
	const bytes = arrayBuffer.byteLength;
	const kilobytes = Math.round(bytes / 1024);
	return kilobytes;
};

const s3 = new AWS.S3({
	endpoint: "https://s3.timeweb.cloud",
	accessKeyId: "JUBT30RXHBQE3133Y62J",
	secretAccessKey: "Yea0YlbOIfRUUyE5M2e3KX1aPyReLsINtVlAtiqh",
	// s3ForcePathStyle: true, // Включи это, если требуется
	signatureVersion: "v4",
});

// Функция для загрузки файла
const uploadFile = async (data: {
	img: Buffer;
	ticketId: string;
	questionId: string;
}) => {
	const { img, ticketId, questionId } = data;
	const bucketName = "ea8b9dd7-1fb48044-a9a0-4288-bfcc-6c73da005f5c";
	const key = `${ticketId}/${questionId}.jpg`;

	const params = {
		Bucket: bucketName,
		Key: key,
		Body: img,
	};

	const result = await s3.upload(params).promise();
	return result.Location;
};

const deleteImage = async (ticketId: string, questionId: string) => {
	const bucketName = "ea8b9dd7-1fb48044-a9a0-4288-bfcc-6c73da005f5c";
	const key = `${ticketId}/${questionId}.jpg`;

	const params = {
		Bucket: bucketName,
		Key: key,
	};

	await s3.deleteObject(params).promise();
};

const saveImage = async ({
	img,
	ticketId,
	questionId,
	imageInDB,
	DBImageOriginalHash,
}: {
	img?: ArrayBuffer;
	ticketId: string;
	questionId: string;
	imageInDB?: string;
	DBImageOriginalHash?: string;
}) => {
	if (!img) {
		await deleteImage(ticketId, questionId);
		return { img: "", imageOriginalHash: "", imagePrcessedHash: "" };
	}

	const imageSizeBefore = calculateSizeInKB(img);
	//
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

	const filePath = await uploadFile({
		img: processedImage,
		ticketId,
		questionId,
	});

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

	return { img: filePath || "", imageOriginalHash, imagePrcessedHash };
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
		const questionId = Number(new Date()).toString();
		const savedImageInfo = await saveImage({ img, ticketId, questionId });

		const answersWithId = answers.map((answer, i) => {
			const answerId = Number(new Date()).toString() + i;
			return { answerText: answer, isCorrect: i === correctAnswer, answerId };
		});

		await ticketEditorRepository.createQuestion({
			imgInfo: savedImageInfo,
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
		const savedImageInfo = await saveImage({
			img,
			ticketId,
			questionId,
			imageInDB: imgInfo.img,
			DBImageOriginalHash: imgInfo.imageOriginalHash,
		});

		const answersWithId = answers.map((answer, i) => {
			const answerId = Number(new Date()).toString() + i;
			return { answerText: answer, isCorrect: i === correctAnswer, answerId };
		});

		await ticketEditorRepository.editQuestion({
			imgInfo: savedImageInfo,
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
