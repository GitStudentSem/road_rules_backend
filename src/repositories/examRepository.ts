import { DBError } from "../controllers/DBError";
import { HTTP_STATUSES } from "../utils";
import { ticketCollection, userCollection } from "./db";
import type { CreateQuestionDBModel } from "../models/ticketEditor/CreateQuestionDBModel";
import type { UserLoginDBModel } from "../models/auth/UserLoginDBModel";
import type { WithId } from "mongodb";

const isTicketExist = async (ticketId: string) => {
	const ticket = await ticketCollection.findOne({ ticketId });
	if (!ticket) {
		throw new DBError("Билет не найден", HTTP_STATUSES.NOT_FOUND_404);
	}

	return ticket;
};

const randomInteger = (min: number, max: number) => {
	// случайное число от min до (max+1)
	const rand = min + Math.random() * (max + 1 - min);
	return Math.floor(rand);
};

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

const getTicketsIds = async () => {
	const ticketsIds = await ticketCollection
		.aggregate<{ ticketId: string }>([
			// Сортируем документы по полю 'createdAt'
			{ $sort: { createdAt: 1 } },

			// Группируем по 'ticketId' и добавляем уникальные ticketId в массив
			{ $group: { _id: "$ticketId", createdAt: { $first: "$createdAt" } } },

			// Проектируем только ticketId
			{ $project: { _id: 0, ticketId: "$_id" } },

			// Финальная сортировка по полю 'createdAt'
			{ $sort: { createdAt: 1 } },
		])
		.toArray();

	return ticketsIds;
};

const getRandomTicketId = async () => {
	const ticketsIds = await getTicketsIds();
	const randomIndex = randomInteger(0, ticketsIds.length - 1);
	return ticketsIds[randomIndex].ticketId;
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

type QuestionWithTicketId = CreateQuestionDBModel & {
	ticketId: string;
};

export const examRepository = {
	async sendExam(userId: string) {
		await isUserExist(userId);
		await removePreviousAnswers(userId);

		const tickets: QuestionWithTicketId[] = [];

		while (tickets.length < 20) {
			const ticketId = await getRandomTicketId();
			const ticket = await isTicketExist(ticketId);
			const randomIndex = randomInteger(0, ticket.questions.length - 1);
			const randomQuestion = ticket.questions[randomIndex];
			if (!randomQuestion || !randomQuestion.answers.length) {
				continue;
			}
			tickets.push({ ...randomQuestion, ticketId });
		}
		const update = {
			$set: {
				"results.exam.passAt": Number(new Date()),
			},
		};

		await userCollection.updateOne({ userId }, update, { upsert: true });
		return tickets;
	},

	async sendExamAnswer(data: {
		userId: string;
		ticketId: string;
		questionId: string;
		answerId: string;
	}) {
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

	async sendTrainingExamAnswer(data: {
		userId: string;
		ticketId: string;
		questionId: string;
		answerId: string;
	}) {
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

	async setAlwaysCompleteExam(data: {
		email: string;
		isAlwaysComplete: boolean;
	}) {
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
