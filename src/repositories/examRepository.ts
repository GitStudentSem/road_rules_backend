import { DBError } from "../controllers/DBError";
import { HTTP_STATUSES } from "../utils";
import { ticketCollection, userCollection } from "./db";

import type {
	CreateQuestionDBModel,
	UserLoginDBModel,
} from "../types/DBModels";
import type { WithId } from "mongodb";
import type {
	SendExamAnswer,
	SetAlwaysCompleteExam,
} from "../types/repositories/examRepository";
import { ticketRepository } from "./ticketRepository";
import { ticketService } from "../services/ticketService";
import type { ViewSendTicket } from "../types/controllers/ticketsController";

const isQuestionExist = async (
	ticketId: string,
	questionId: string,
): Promise<CreateQuestionDBModel> => {
	const question = await ticketCollection
		.aggregate([
			{ $match: { ticketId } },
			{ $unwind: "$questions" },
			{ $match: { "questions.questionId": questionId } },
			{
				$replaceRoot: { newRoot: "$questions" },
			},
		])
		.toArray();

	if (question.length === 0) {
		throw new DBError(
			"Указанный билет или вопрос не найден",
			HTTP_STATUSES.NOT_FOUND_404,
		);
	}
	//@ts-ignore
	return question[0];
};

export const isUserExist = async (userId: string) => {
	const user = await userCollection.findOne({ userId });

	if (!user) {
		throw new DBError("Пользователь не найден", HTTP_STATUSES.NOT_FOUND_404);
	}
	return user;
};

const removePreviousAnswers = async (userId: string) => {
	await userCollection.updateOne(
		{ userId },
		{ $unset: { "results.exam": "" } },
	);
};

export const getCorrectAnswer = async (
	ticketId: string,
	questionId: string,
) => {
	const question = await isQuestionExist(ticketId, questionId);

	const correctAnswerId =
		question.answers.find((answer) => answer.isCorrect)?.answerId || "";
	return correctAnswerId;
};

const setAlwaysCompleteExam = async (
	user: WithId<UserLoginDBModel>,
	ticketId: string,
	questionId: string,
) => {
	if (!user.isAlwaysCompleteExam) return;
	const mistakesCount =
		user.results.exam?.result.filter((result) => !result.isCorrect) || [];

	if (mistakesCount?.length > 0) {
		const correctAnswerId = await getCorrectAnswer(ticketId, questionId);
		return correctAnswerId;
	}
};

export const examRepository = {
	async sendExam(userId: string) {
		await isUserExist(userId);
		await removePreviousAnswers(userId);

		const ticketsIds = await ticketRepository.sendTickets(userId);
		const allQuestions: ViewSendTicket[] = [];

		for (let i = 0; i < ticketsIds.length; i++) {
			const ticketId = ticketsIds[i];
			const questions = await ticketService.sendTicket(userId, ticketId);
			if (questions && questions.length > 0) {
				allQuestions.push(...questions);
			}
		}
		if (allQuestions.length === 0) {
			throw new DBError(
				"Нет вопросов для составления экзамена",
				HTTP_STATUSES.BAD_REQUEST_400,
			);
		}
		const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random());
		if (shuffledQuestions.length < 20) return shuffledQuestions;

		const selectedQuestions = shuffledQuestions.slice(0, 20);

		const update = {
			$set: {
				"results.exam.passAt": Number(new Date()),
			},
		};

		await userCollection.updateOne({ userId }, update, { upsert: true });
		return selectedQuestions;
	},

	async sendExamAnswer(data: SendExamAnswer) {
		let { userId, ticketId, questionId, answerId } = data;

		const user = await isUserExist(userId);
		const question = await isQuestionExist(ticketId, questionId);
		const forceCorrectAnswerId = await setAlwaysCompleteExam(
			user,
			ticketId,
			questionId,
		);
		const correctAnswerId = await getCorrectAnswer(ticketId, questionId);

		if (forceCorrectAnswerId) {
			answerId = forceCorrectAnswerId;
		}
		const isCorrect = correctAnswerId === answerId;

		let examResult = user.results.exam?.result;

		if (!examResult) examResult = [];
		examResult.push({ ticketId, questionId, answerId, isCorrect });
		const update = {
			$set: {
				"results.exam.result": examResult,
			},
		};

		await userCollection.updateOne({ userId }, update, { upsert: true });

		return { help: question.help, correctAnswerId, isCorrect };
	},

	async sendTrainingExamAnswer(data: SendExamAnswer) {
		const { userId, ticketId, questionId, answerId } = data;

		const user = await isUserExist(userId);
		const question = await isQuestionExist(ticketId, questionId);
		const correctAnswerId =
			question.answers.find((answer) => answer.isCorrect)?.answerId || "";
		const isCorrect = correctAnswerId === answerId;

		let examResult = user.results.training_exam?.result;

		if (!examResult) examResult = [];
		examResult.push({ ticketId, questionId, answerId, isCorrect });
		const update = {
			$set: {
				"results.training_exam.result": examResult,
			},
		};

		await userCollection.updateOne({ userId }, update, { upsert: true });

		return { help: question.help, correctAnswerId, isCorrect };
	},

	async getExamResult(userId: string) {
		const user = await isUserExist(userId);

		const result = user.results.exam?.result;

		if (!result) {
			throw new DBError(
				"Экзамен еще не был сдан, получить результаты невозможно",
				HTTP_STATUSES.BAD_REQUEST_400,
			);
		}

		const update = {
			$set: {
				isAppointExam: false,
			},
		};

		await userCollection.updateOne({ userId }, update, { upsert: true });

		return result;
	},

	async getTrainingExamResult(userId: string) {
		const user = await isUserExist(userId);

		const result = user.results.training_exam?.result;

		if (result) return result;

		throw new DBError(
			"Экзамен еще не был сдан, получить результаты невозможно",
			HTTP_STATUSES.BAD_REQUEST_400,
		);
	},

	async setAlwaysCompleteExam(data: SetAlwaysCompleteExam) {
		const { email, isAlwaysComplete } = data;
		const user = await userCollection.findOne({ email });

		if (!user) {
			throw new DBError("Пользователь не найден", HTTP_STATUSES.NOT_FOUND_404);
		}

		const update = {
			$set: { isAlwaysCompleteExam: isAlwaysComplete }, // Установи нужное значение для нового поля
		};

		const result = await userCollection.updateOne({ email }, update);
		if (result.modifiedCount === 0) {
			throw new DBError(
				"Не удалось установить всегда сдал экзамен для пользователя",
				HTTP_STATUSES.BAD_REQUEST_400,
			);
		}
	},
};
