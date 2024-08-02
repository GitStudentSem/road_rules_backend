import { userEditorRepository } from "../repositories/userEditorRepository";
import { DBError } from "../controllers/DBError";
import { HTTP_STATUSES } from "../utils";
import type { CreateQuestionDBModel } from "../models/ticketEditor/CreateQuestionDBModel";
import { ticketRepository } from "../repositories/ticketRepository";
import type { Result } from "../models/auth/UserLoginDBModel";
import type { ViewClearQuestionInfo } from "../types/controllers/userEditorController";

const removeUnusedInfoFromQuestion = (
	question: CreateQuestionDBModel,
	result: Result,
): ViewClearQuestionInfo => {
	return {
		userResultInfo: {
			isCorrect: result.isCorrect,
			ticketId: result.ticketId,
			questionId: result.questionId,
			answerId: result.answerId,
		},
		questionInfo: {
			question: question.question,
			img: question.imgInfo.img,
			help: question.help,
			answers: question.answers,
		},
	};
};

export const userEditorService = {
	async getAllUsers(userId: string) {
		const allUsers = await userEditorRepository.getAllUsers(userId);
		const filterdUsersData = allUsers.map((user) => {
			return {
				email: user.email,
				firstName: user.firstName,
				secondName: user.secondName,
				examResults: user.results.exam,
				role: user.role,
				isAppointExam: user.isAppointExam,
				department: user.department,
			};
		});
		return filterdUsersData;
	},

	async getUsersWithExam(userId: string) {
		const allUsers = await userEditorRepository.getUsersWithExam(userId);
		const filterdUsersData = allUsers.map((user) => {
			return {
				email: user.email,
				firstName: user.firstName,
				secondName: user.secondName,
				examResults: user.results.exam,
				role: user.role,
				isAppointExam: user.isAppointExam,
				department: user.department,
			};
		});
		return filterdUsersData;
	},

	async setRole(data: {
		userId: string;
		email: string;
		role: "user" | "admin";
	}) {
		const { userId, email, role } = data;

		if (role !== "admin" && role !== "user") {
			throw new DBError(
				"Указан несуществующий тип роли",
				HTTP_STATUSES.BAD_REQUEST_400,
			);
		}

		await userEditorRepository.setRole({ userId, email, role });
	},

	async appointExam(data: {
		isAppoint: boolean;
		email: string;
		userId: string;
	}) {
		await userEditorRepository.appointExam(data);
	},

	async deleteUser(data: { userId: string; email: string }) {
		const { userId, email } = data;

		await userEditorRepository.deleteUser({ userId, email });
	},

	async getExamResult(data: {
		email: string;
		userId: string;
	}) {
		const examResult = await userEditorRepository.getExamResult({
			email: data.email,
			userId: data.userId,
		});

		const questions: ViewClearQuestionInfo[] = [];

		for (const result of examResult) {
			const question = await ticketRepository.getQuestionInTicket({
				ticketId: result.ticketId,
				questionId: result.questionId,
			});

			questions.push(removeUnusedInfoFromQuestion(question, result));
		}

		return questions;
	},
};
