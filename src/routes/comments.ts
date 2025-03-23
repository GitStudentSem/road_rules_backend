import type { Socket, Server } from "socket.io";

import { commentsService } from "../services/commentsService";
import { DBError } from "../controllers/DBError";
import { getErrorSwaggerDoc } from "../assets/getErrorSwaggerDoc";
import {
	type BodyDeleteComment,
	BodyDeleteCommentSwaggerDoc,
	type BodySendAllComments,
	BodySendAllCommentsSwaggerDoc,
	type BodySendComment,
	BodySendCommentSwaggerDoc,
	ViewDeleteCommentSwaggerDoc,
	ViewSendAllCommentsSwaggerDoc,
	ViewSendCommentSwaggerDoc,
} from "../types/controllers/commentsController";
import { defaultSwaggerValues } from "../assets/settings";

enum Events {
	error = "error",
	send_comment = "send_comment",
	get_all_comments = "get_all_comments",
	delete_comment = "delete_comment",
}

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
	[`/api/comments/${Events.send_comment}`]: {
		post: {
			tags: ["Комментарии"],
			summary: "Отправка комментария",
			security: [{ bearerAuth: [] }],
			description: `Клиент отправляет комментарий через событие emit('${Events.send_comment}')`,
			requestBody: {
				content: {
					"application/json": {
						schema: BodySendCommentSwaggerDoc,
					},
				},
			},
			responses: {
				200: {
					description: `Клиент получает комментарий через событие on('${Events.send_comment}')`,
					content: {
						"application/json": {
							schema: ViewSendCommentSwaggerDoc,
						},
					},
				},
				error: getErrorSwaggerDoc(
					`Ошибка отправки комментария через on('${Events.error}')`,
				),
			},
		},
	},

	[`/api/comments/${Events.get_all_comments}`]: {
		post: {
			tags: ["Комментарии"],
			summary: "Получить все комментарии",
			security: [{ bearerAuth: [] }],
			description: `Клиент отправляет комментарий через событие emit('${Events.get_all_comments}')`,
			requestBody: {
				content: {
					"application/json": {
						schema: BodySendAllCommentsSwaggerDoc,
					},
				},
			},
			responses: {
				200: {
					description: `Клиент получает комментарий через событие on('${Events.get_all_comments}')`,
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
					`Ошибка отправки комментариев через on('${Events.error}')`,
				),
			},
		},
	},
	[`/api/comments/${Events.delete_comment}`]: {
		post: {
			tags: ["Комментарии"],
			summary: "Удалить комментарий",
			security: [{ bearerAuth: [] }],
			description: `Клиент отправляет комментарий через событие emit('${Events.delete_comment}')`,
			requestBody: {
				content: {
					"application/json": {
						schema: BodyDeleteCommentSwaggerDoc,
					},
				},
			},
			responses: {
				200: {
					description: `Клиент получает удаленный комментарий через событие on('${Events.delete_comment}')`,
					content: {
						"application/json": {
							schema: ViewDeleteCommentSwaggerDoc,
						},
					},
				},
				error: getErrorSwaggerDoc(
					`Ошибка удаления комментария через on('${Events.error}')`,
				),
			},
		},
	},
};

const catchError = (socket: Socket, error: unknown) => {
	if (error instanceof DBError) {
		socket.emit(Events.error, {
			message: error.message,
			status: error.status,
		});
		return;
	}

	if (error instanceof Error) {
		console.log(error);
		socket.emit(Events.error, {
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
	socket.on(Events.send_comment, async (data: BodySendComment) => {
		try {
			console.log(Events.send_comment, data);
			const savedMessage = await commentsService.sendMessage(userId, data);
			commentsNamespace.emit(Events.send_comment, savedMessage);
		} catch (error) {
			catchError(socket, error);
		}
	});

	socket.on(Events.get_all_comments, async (data: BodySendAllComments) => {
		try {
			const messages = await commentsService.getAllComments(data);
			socket.emit(Events.get_all_comments, messages);
		} catch (error) {
			catchError(socket, error);
		}
	});
	socket.on(Events.delete_comment, async (data: BodyDeleteComment) => {
		try {
			const deletedComment = await commentsService.deletedComment(data);
			socket.emit(Events.delete_comment, deletedComment);
		} catch (error) {
			catchError(socket, error);
		}
	});

	// Обработка отключения клиента
	socket.on("disconnect", () => {
		console.log("A client disconnected:", socket.id);
	});
};
