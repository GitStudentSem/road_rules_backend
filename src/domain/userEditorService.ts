import { userEditorRepository } from "../repositories/userEditorRepository";
import { DBError } from "../controllers/DBError";
import { HTTP_STATUSES } from "../utils";

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
			};
		});
		console.log("", filterdUsersData);
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
};
