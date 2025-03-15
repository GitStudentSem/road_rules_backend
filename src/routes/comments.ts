import type { Socket, Server } from "socket.io";

import { commentsService } from "../services/commentsService";
import { DBError } from "../controllers/DBError";
import { getErrorSwaggerDoc } from "../assets/getErrorSwaggerDoc";
import {
	type BodySendAllComments,
	BodySendAllCommentsSwaggerDoc,
	type BodySendComment,
	BodySendCommentSwaggerDoc,
	ViewSendAllCommentsSwaggerDoc,
	ViewSendCommentSwaggerDoc,
} from "../types/controllers/commentsController";
import { defaultSwaggerValues } from "../assets/settings";

export const commentsConnectSwaggerDoc = {
	"/api/comments": {
		post: {
			tags: ["Комментарии"],
			summary: " Подключение к сокету комментариев",
			security: [{ bearerAuth: [] }],
			description:
				"Клиент отправляет комментарий через событие io(http://localhost:3333/api/comments, {[options]})",
			requestBody: {
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								query: {
									type: "object",
									properties: {
										token: {
											type: "string",
											default: defaultSwaggerValues.authToken,
											description: "Токен авторизации",
										},
									},
								},
							},
						},
					},
				},
			},
			responses: {
				200: {
					description: "Клиент успешно подключен к комментариям",
				},
				error: getErrorSwaggerDoc(
					"Ошибка подключения к сокету через on('connect_error')",
				),
			},
		},
	},
};

export const commentsSwaggerDoc = {
	"/api/comments/send_comment": {
		post: {
			tags: ["Комментарии"],
			summary: "Отправка комментария",
			security: [{ bearerAuth: [] }],
			description:
				"Клиент отправляет комментарий через событие emit(send_comment)",
			requestBody: {
				content: {
					"application/json": {
						schema: BodySendCommentSwaggerDoc,
					},
				},
			},
			responses: {
				200: {
					description:
						"Клиент получает комментарий через событие on(send_comment)",
					content: {
						"application/json": {
							schema: ViewSendCommentSwaggerDoc,
						},
					},
				},
				error: getErrorSwaggerDoc(
					"Ошибка отправки комментария через on('error')",
				),
			},
		},
	},

	"/api/comments/get_all_comments": {
		post: {
			tags: ["Комментарии"],
			summary: "Получить все комментарии",
			security: [{ bearerAuth: [] }],
			description:
				"Клиент отправляет комментарий через событие emit(get_all_comments)",
			requestBody: {
				content: {
					"application/json": {
						schema: BodySendAllCommentsSwaggerDoc,
					},
				},
			},
			responses: {
				200: {
					description:
						"Клиент получает комментарий через событие on(get_all_comments)",
					content: {
						"application/json": {
							schema: {
								type: "array",
								description: "Комментарии к данному вопросу",
								items: ViewSendAllCommentsSwaggerDoc,
							},
						},
					},
				},
				error: getErrorSwaggerDoc(
					"Ошибка отправки комментариев через on('error')",
				),
			},
		},
	},
};

const catchError = (socket: Socket, error: unknown) => {
	if (error instanceof DBError) {
		socket.emit("error", {
			message: error.message,
			status: error.status,
		});
		return;
	}

	if (error instanceof Error) {
		socket.emit("error", {
			message: error.message,
			status: 500,
		});
		return;
	}
};

export const commentsRouter = (socket: Socket, commentsNamespace) => {
	const { userId } = socket;
	if (!userId) return;

	// Клиент отправляет сообщение
	socket.on("send_comment", async (data: BodySendComment) => {
		try {
			const savedMessage = await commentsService.sendMessage(userId, data);
			commentsNamespace.emit("send_comment", savedMessage);
		} catch (error) {
			console.log("send_comment", error);
			catchError(socket, error);
		}
	});

	socket.on("get_all_comments", async (data: BodySendAllComments) => {
		try {
			const messages = await commentsService.getAllComments(data);
			socket.emit("get_all_comments", messages);
		} catch (error) {
			console.log("get_all_comments", error);
			catchError(socket, error);
		}
	});

	// Обработка отключения клиента
	socket.on("disconnect", () => {
		console.log("A client disconnected:", socket.id);
	});
};
