import sharp from "sharp";
import { ticketEditorRepository } from "../repositories/ticketEditorRepository";
import { colors, resetStyle, styles } from "../assets/logStyles";
import { crc32 } from "crc";

import { DBError } from "../controllers/DBError";
import { HTTP_STATUSES } from "../utils";
import type {
	CreateQuestion,
	DeleteQuestion,
	EditQuestion,
	ListParams,
	SaveImage,
	UploadFile,
} from "../types/services/ticketEditorService";
import { commentsRepository } from "../repositories/commentsRepository";
import { s3 } from "../app";

const calculateSizeInKB = (arrayBuffer: ArrayBuffer) => {
	const bytes = arrayBuffer.byteLength;
	const kilobytes = Math.round(bytes / 1024);
	return kilobytes;
};

// Функция для загрузки файла
const uploadFile = async (data: UploadFile) => {
	const { img, ticketId, questionId } = data;
	const bucketName = process.env.BUCKET_NAME_FOR_S3 || "";
	const key = `${ticketId}/${questionId}.jpg`;

	const params = {
		Bucket: bucketName,
		Key: key,
		Body: img,
	};

	const result = await s3.upload(params).promise();
	return result.Location;
};

const deleteImageFromQuestion = async (
	ticketId: string,
	questionId: string,
) => {
	const bucketName = process.env.BUCKET_NAME_FOR_S3 || "";
	const key = `${ticketId}/${questionId}.jpg`;

	const params = {
		Bucket: bucketName,
		Key: key,
	};

	await s3.deleteObject(params).promise();
};

const deleteAllImagesInFolderFolder = async (ticketId: string) => {
	try {
		// Получаем список объектов в папке
		const listParams: ListParams = {
			Bucket: process.env.BUCKET_NAME_FOR_S3 || "",
			Prefix: ticketId,
		};

		const listedObjects = await s3.listObjectsV2(listParams).promise();

		if (!listedObjects.Contents) return;

		if (listedObjects.Contents.length === 0) return;

		// Создаем массив объектов для удаления
		const deleteParams = {
			Bucket: process.env.BUCKET_NAME_FOR_S3 || "",
			Delete: { Objects: [] },
		};

		for (const content of listedObjects.Contents) {
			//@ts-ignore
			deleteParams.Delete.Objects.push({ Key: content.Key });
		}

		// Удаляем объекты
		await s3.deleteObjects(deleteParams).promise();

		// Если есть еще объекты, повторяем процесс
		if (listedObjects.IsTruncated) {
			await deleteAllImagesInFolderFolder(ticketId);
		}
	} catch (err) {
		console.error("Ошибка при удалении папки:", err);
		throw new DBError(
			"Ошибка при удалении папки изображений",
			HTTP_STATUSES.BAD_REQUEST_400,
		);
	}
};

const saveImage = async ({
	img,
	ticketId,
	questionId,
	imageInDB,
	DBImageOriginalHash,
}: SaveImage) => {
	if (!img) {
		await deleteImageFromQuestion(ticketId, questionId);
		return { img: "", imageOriginalHash: "", imagePrcessedHash: "" };
	}

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
	async sendTickets(userId: string) {
		const ticketsIds = await ticketEditorRepository.sendTickets(userId);

		return ticketsIds;
	},

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

	async createQuestion(data: CreateQuestion) {
		const { img, ticketId, question, help, correctAnswer, answers, userId } =
			data;

		await ticketEditorRepository.checkMaxCountQuestions(ticketId);

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

	async editQuestion(data: EditQuestion) {
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
		const isDeleted = await ticketEditorRepository.deleteTicket(
			ticketId,
			userId,
		);
		if (isDeleted) {
			await deleteAllImagesInFolderFolder(ticketId);
			await commentsRepository.deleteAllCommentsForTicketId(ticketId);
		}
	},

	async deleteQuestion(data: DeleteQuestion) {
		const { ticketId, questionId, userId } = data;

		const isDeleted = await ticketEditorRepository.deleteQuestion({
			ticketId,
			questionId,
			userId,
		});

		if (isDeleted) {
			await deleteImageFromQuestion(ticketId, questionId);
			await commentsRepository.deleteAllCommentsForQuestionId(data.questionId);
		}
	},
};
