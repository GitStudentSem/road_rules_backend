import { userEditorRepository } from "../repositories/userEditorRepository";
import { DBError } from "../controllers/DBError";
import { HTTP_STATUSES } from "../utils";
import type { CreateQuestionDBModel } from "../types/DBModels";
import { ticketRepository } from "../repositories/ticketRepository";
import type {
	AppointExam,
	DeleteUser,
	GetExamResult,
	ExamResult,
	SetRole,
	Result,
	IsBannedForChat,
} from "../types/services/userEditorService";
import { s3 } from "../app";

const deleteAvatar = async (userId: string) => {
	const bucketName = process.env.BUCKET_NAME_FOR_S3 || "";
	const key = `avatars/${userId}.jpg`;

	const params = {
		Bucket: bucketName,
		Key: key,
	};

	await s3.deleteObject(params).promise();
};

const removeUnusedInfoFromQuestion = (
	question: CreateQuestionDBModel,
	result: Result,
): ExamResult => {
	return {
		question: question.question,
		img: question.imgInfo.img,
		help: question.help,
		answers: question.answers,
		questionId: result.questionId,
		userAnswerId: result.answerId,
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
				role: user.role,
				isAppointExam: user.isAppointExam,
				autoSchoolName: user.autoSchoolName,
			};
		});
		return filterdUsersData;
	},

	async getUsersWithAppointExam(userId: string) {
		const allUsers = await userEditorRepository.getUsersWithAppointExam(userId);
		const filterdUsersData = allUsers.map((user) => {
			return {
				email: user.email,
				firstName: user.firstName,
				secondName: user.secondName,
				role: user.role,
				isAppointExam: user.isAppointExam,
				autoSchoolName: user.autoSchoolName,
			};
		});
		return filterdUsersData;
	},

	async getUsersWithResultExam(userId: string, isPassExam: boolean) {
		const allUsers = await userEditorRepository.getAllUsers(userId);
		const filterdUsers = allUsers.filter((user) => {
			const results = user.results.exam?.result;
			if (!results) return false;
			const correctAnswers = results.filter((result) => result.isCorrect) || [];
			return isPassExam
				? correctAnswers.length >= 18
				: correctAnswers.length < 18;
		});

		const filterdUsersData = filterdUsers.map((user) => {
			return {
				email: user.email,
				firstName: user.firstName,
				secondName: user.secondName,
				role: user.role,
				isAppointExam: user.isAppointExam,
				autoSchoolName: user.autoSchoolName,
				passAt: user.results.exam?.passAt || 0,
			};
		});
		return filterdUsersData;
	},

	async setRole(data: SetRole) {
		const { userId, email, role } = data;

		if (role !== "admin" && role !== "user") {
			throw new DBError(
				"Указан несуществующий тип роли",
				HTTP_STATUSES.BAD_REQUEST_400,
			);
		}

		await userEditorRepository.setRole({ userId, email, role });
	},

	async appointExam(data: AppointExam) {
		await userEditorRepository.appointExam(data);
	},

	async setIsBannedForChat(data: IsBannedForChat) {
		await userEditorRepository.setIsBannedForChat(data);
	},

	async deleteUser(data: DeleteUser) {
		const { userId, email } = data;
		const deletedUserId = await userEditorRepository.deleteUser({
			userId,
			email,
		});
		deleteAvatar(deletedUserId);
	},

	async getExamResult(data: GetExamResult) {
		const examResult = await userEditorRepository.getExamResult({
			email: data.email,
			userId: data.userId,
		});

		const questions: ExamResult[] = [];

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
