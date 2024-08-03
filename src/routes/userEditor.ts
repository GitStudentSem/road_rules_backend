import express from "express";
import { userEditorController } from "../controllers/userEditorController";
import {
	appointExamValidation,
	checkIsPassExam,
	isEmailValid,
} from "../validations";
import { checkAuth, handleValidationErrors } from "../midlewares";
import { getErrorSwaggerDoc } from "../assets/getErrorSwaggerDoc";
import { GetAllUsersViewModelSwaggerDoc } from "../models/auth/GetAllUsersViewModel";
import { BodyAppointExamSwaggerDoc } from "../models/exam/BodyAppointExam";
import { defaultSwaggerValues } from "../assets/settings";
import { ViewClearQuestionInfoSwaggerDoc } from "../types/controllers/userEditorController";

export const userEditorSwaggerDoc = {
	"/api/userEditor/role": {
		patch: {
			tags: ["Редактор пользователей"],
			summary: "Установить роль для пользователя",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								email: {
									type: "string",
									default: defaultSwaggerValues.email,
									description: "Почта пользователя",
								},
								role: {
									type: "admin | user",
									default: "user",
									description: "Роль пользователя",
								},
							},
						},
					},
				},
			},
			responses: {
				204: {
					description: "Пользователь удален",
				},
				error: getErrorSwaggerDoc("Ошибка удаления пользователя"),
			},
		},
	},
	"/api/userEditor/getAllUsers": {
		get: {
			tags: ["Редактор пользователей"],
			summary: "Получить всех пользователей",
			security: [{ bearerAuth: [] }],
			responses: {
				200: {
					description: "Все пользователи получены",
					content: {
						"application/json": {
							schema: {
								type: "array",
								items: GetAllUsersViewModelSwaggerDoc,
							},
						},
					},
				},
				error: getErrorSwaggerDoc("Ошибка получения всех пользователей"),
			},
		},
	},
	"/api/userEditor/getUsersWithExam": {
		get: {
			tags: ["Редактор пользователей"],
			summary: "Получить всех пользователей у которых назначен экзамен",
			security: [{ bearerAuth: [] }],
			responses: {
				200: {
					description: "Все пользователи с назначенным экзаменом получены",
					content: {
						"application/json": {
							schema: {
								type: "array",
								items: GetAllUsersViewModelSwaggerDoc,
							},
						},
					},
				},
				error: getErrorSwaggerDoc(
					"Ошибка получения всех пользователей с назначенным экзаменом",
				),
			},
		},
	},
	"/api/userEditor/appoint": {
		post: {
			tags: ["Редактор пользователей"],
			summary: "Назначить экзамен для пользователя",
			security: [{ bearerAuth: [] }],

			requestBody: {
				content: {
					"application/json": {
						schema: BodyAppointExamSwaggerDoc,
					},
				},
			},
			responses: {
				204: {
					description: "Экзамен назначен",
				},
				error: getErrorSwaggerDoc("Ошибка назначения экзамена"),
			},
		},
	},

	"/api/userEditor/deleteUser": {
		delete: {
			tags: ["Редактор пользователей"],
			summary: "Удалить пользователя по почте",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								email: {
									type: "string",
									default: defaultSwaggerValues.email,
									description: "Почта пользователя",
								},
							},
						},
					},
				},
			},
			responses: {
				204: {
					description: "Пользователь удален",
				},
				error: getErrorSwaggerDoc("Ошибка удаления пользователя"),
			},
		},
	},
	"/api/userEditor/getExamResult": {
		post: {
			tags: ["Редактор пользователей"],
			summary: "Получить результаты экзамена пользователя",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								email: {
									type: "string",
									default: defaultSwaggerValues.email,
									description: "Почта пользователя",
								},
							},
						},
					},
				},
			},
			responses: {
				200: {
					description: "Результаты экзамена успешно получены",
					content: {
						"application/json": {
							schema: {
								type: "array",
								description: "Результаты экзамена пользователя",
								items: ViewClearQuestionInfoSwaggerDoc,
							},
						},
					},
				},
				error: getErrorSwaggerDoc("Ошибка получения результатов"),
			},
		},
	},
	"/api/userEditor/getUsersWithResultExam": {
		post: {
			tags: ["Редактор пользователей"],
			summary: "Получить пользователей который сдали или не сдали экзамен",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								isPassExam: {
									type: "boolean",
									default: true,
									description:
										"Пользователи которые сдали или не сдали экзамен",
								},
							},
						},
					},
				},
			},
			responses: {
				200: {
					description: "Пользователи успешно получены",
					content: {
						"application/json": {
							schema: {
								type: "array",
								description: "Пользователи которые сдали или не сдали экзамен",
								items: GetAllUsersViewModelSwaggerDoc,
							},
						},
					},
				},
				error: getErrorSwaggerDoc(
					"Ошибка получения пользователей по результатам экзамена",
				),
			},
		},
	},
};

export const userEditorRouter = () => {
	const router = express.Router();
	router.get("/getAllUsers", checkAuth, userEditorController.getAllUsers);
	router.get(
		"/getUsersWithAppointExam",
		checkAuth,
		userEditorController.getUsersWithAppointExam,
	);
	router.post(
		"/getUsersWithResultExam",
		checkAuth,
		checkIsPassExam,
		handleValidationErrors,
		userEditorController.getUsersWithResultExam,
	);
	router.patch(
		"/role",
		checkAuth,
		isEmailValid,
		handleValidationErrors,
		userEditorController.setRole,
	);
	router.post(
		"/appoint",
		checkAuth,
		appointExamValidation,
		handleValidationErrors,
		userEditorController.appointExam,
	);
	router.post(
		"/getExamResult",
		checkAuth,
		isEmailValid,
		handleValidationErrors,
		userEditorController.getExamResult,
	);
	router.delete("/deleteUser", checkAuth, userEditorController.deleteUser);
	return router;
};
