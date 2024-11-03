import express from "express";
import { userEditorController } from "../controllers/userEditorController";
import {
	appointExamValidation,
	checkIsPassExam,
	isEmailValid,
} from "../validations";
import { checkAuth, handleValidationErrors } from "../midlewares";
import { getErrorSwaggerDoc } from "../assets/getErrorSwaggerDoc";
import {
	BodyDeleteUserSwaggerDoc,
	BodyGetExamResultSwaggerDoc,
	BodyGetUsersWithResultExamSwaggerDoc,
	BodySetRoleSwaggerDoc,
	ViewUserInfoSwaggerDoc,
} from "../types/controllers/userEditorController";
import { BodyAppointExamSwaggerDoc } from "../types/controllers/userEditorController";
import { ViewClearQuestionInfoSwaggerDoc } from "../types/controllers/userEditorController";

export const userEditorSwaggerDoc = {
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
								items: ViewUserInfoSwaggerDoc,
							},
						},
					},
				},
				error: getErrorSwaggerDoc("Ошибка получения всех пользователей"),
			},
		},
	},

	"/api/userEditor/getUsersWithAppointExam": {
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
								items: ViewUserInfoSwaggerDoc,
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

	"/api/userEditor/getExamResult": {
		post: {
			tags: ["Редактор пользователей"],
			summary: "Получить результаты экзамена пользователя",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: BodyGetExamResultSwaggerDoc,
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
						schema: BodyGetUsersWithResultExamSwaggerDoc,
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
								items: ViewUserInfoSwaggerDoc,
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

	"/api/userEditor/role": {
		patch: {
			tags: ["Редактор пользователей"],
			summary: "Установить роль для пользователя",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: BodySetRoleSwaggerDoc,
					},
				},
			},
			responses: {
				204: {
					description: "роль пользователя обновлена",
				},
				error: getErrorSwaggerDoc("Ошибка установки роли для пользователя"),
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
						schema: BodyDeleteUserSwaggerDoc,
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
	router.patch(
		"/role",
		checkAuth,
		isEmailValid,
		handleValidationErrors,
		userEditorController.setRole,
	);

	router.delete("/deleteUser", checkAuth, userEditorController.deleteUser);
	return router;
};
