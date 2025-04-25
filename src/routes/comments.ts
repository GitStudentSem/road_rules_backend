import type { Socket } from "socket.io";
import { DBError } from "../controllers/DBError";
import { getErrorSwaggerDoc } from "../assets/getErrorSwaggerDoc";
import {
	BodyCommentsCountSwaggerDoc,
	BodyDeleteCommentSwaggerDoc,
	BodyDislikeCommentSwaggerDoc,
	BodyJoinRoomSwaggerDoc,
	BodyLikeCommentSwaggerDoc,
	BodySendAllCommentsSwaggerDoc,
	BodySendCommentSwaggerDoc,
	BodySendReplyToCommentSwaggerDoc,
	ViewCommentsCountSwaggerDoc,
	ViewDeleteCommentSwaggerDoc,
	ViewDislikeCommentSwaggerDoc,
	ViewLikeCommentSwaggerDoc,
	ViewSendAllCommentsSwaggerDoc,
	ViewSendCommentSwaggerDoc,
	ViewSendReplyToCommentSwaggerDoc,
} from "../types/controllers/commentsController";
import type {
	BodyDeleteComment,
	BodyDislikeComment,
	BodyJoinRoom,
	BodyLikeComment,
	BodySendAllComments,
	BodySendComment,
} from "../types/controllers/commentsController";
import { defaultSwaggerValues } from "../assets/settings";
import { commentsController } from "../controllers/commentsController";
import { commentsNamespace } from "..";
import express from "express";
import { checkAuth } from "../midlewares";

export enum Events {
	error = "error",
	join_room = "join_room",
	send_comment = "send_comment",
	send_reply_for_comment = "send_reply_to_comment",
	get_all_comments = "get_all_comments",
	delete_comment = "delete_comment",
	like_comment = "like_comment",
	dislike_comment = "dislike_comment",
}

export const commentsConnectSwaggerDoc = {
	"/api/comments (socket)": {
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
	[`socket.emit("${Events.join_room}")`]: {
		post: {
			tags: ["Комментарии"],
			summary: "Подключится к комнате для комментариев",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: BodyJoinRoomSwaggerDoc,
					},
				},
			},
		},
	},

	[`socket.emit("${Events.send_comment}")`]: {
		post: {
			tags: ["Комментарии"],
			summary: "Отправка комментария",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: BodySendCommentSwaggerDoc,
					},
				},
			},
			responses: {
				error: getErrorSwaggerDoc(
					`Ошибка отправки комментария через on('${Events.error}')`,
				),
			},
		},
	},

	[`socket.on("${Events.send_comment}")`]: {
		get: {
			tags: ["Комментарии"],
			summary: "Получение нового комментария",
			security: [{ bearerAuth: [] }],

			responses: {
				200: {
					description: "Полученный комментарий",
					content: {
						"application/json": {
							schema: ViewSendCommentSwaggerDoc,
						},
					},
				},
			},
		},
	},

	[`socket.emit("${Events.get_all_comments}")`]: {
		post: {
			tags: ["Комментарии"],
			summary: "Запрос на получение всех комментариев к вопросу",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: BodySendAllCommentsSwaggerDoc,
					},
				},
			},
			responses: {
				error: getErrorSwaggerDoc(
					`Ошибка отправки всех комментариев через on('${Events.error}')`,
				),
			},
		},
	},

	[`socket.on("${Events.get_all_comments}")`]: {
		get: {
			tags: ["Комментарии"],
			summary: "Получить все комментарии",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: BodySendAllCommentsSwaggerDoc,
					},
				},
			},
			responses: {
				200: {
					description: "Массив всех комментариев к данному вопросу",
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
			},
		},
	},

	[`socket.emit("${Events.delete_comment}")`]: {
		post: {
			tags: ["Комментарии"],
			summary: "Удалить комментарий",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: BodyDeleteCommentSwaggerDoc,
					},
				},
			},
			responses: {
				error: getErrorSwaggerDoc(
					`Ошибка удаления комментария через on('${Events.error}')`,
				),
			},
		},
	},

	[`socket.on("${Events.delete_comment}")`]: {
		get: {
			tags: ["Комментарии"],
			summary: "Получить удаленный комментарий",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: BodyDeleteCommentSwaggerDoc,
					},
				},
			},
			responses: {
				200: {
					description: "Удаленный комментарий",
					content: {
						"application/json": {
							schema: ViewDeleteCommentSwaggerDoc,
						},
					},
				},
			},
		},
	},

	[`socket.emit("${Events.like_comment}")`]: {
		post: {
			tags: ["Комментарии"],
			summary: "Лайкнуть комментарий",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: BodyLikeCommentSwaggerDoc,
					},
				},
			},
			responses: {
				error: getErrorSwaggerDoc(
					`Ошибка лайка комментария через on('${Events.error}')`,
				),
			},
		},
	},

	[`socket.on("${Events.like_comment}")`]: {
		get: {
			tags: ["Комментарии"],
			summary: "Получить все лайки комментария",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: BodyLikeCommentSwaggerDoc,
					},
				},
			},
			responses: {
				200: {
					description: "Новый массив лайков для данного комментария",
					content: {
						"application/json": {
							schema: ViewLikeCommentSwaggerDoc,
						},
					},
				},
			},
		},
	},

	[`socket.emit("${Events.dislike_comment}")`]: {
		post: {
			tags: ["Комментарии"],
			summary: "Дизлайкнуть комментарий",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: BodyDislikeCommentSwaggerDoc,
					},
				},
			},
			responses: {
				error: getErrorSwaggerDoc(
					`Ошибка дизлайка комментария через on('${Events.error}')`,
				),
			},
		},
	},
	[`socket.on("${Events.dislike_comment}")`]: {
		get: {
			tags: ["Комментарии"],
			summary: "Получить все дизлайки комментария",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: BodyDislikeCommentSwaggerDoc,
					},
				},
			},
			responses: {
				200: {
					description: "Новый массив дизлайков для данного комментария",
					content: {
						"application/json": {
							schema: ViewDislikeCommentSwaggerDoc,
						},
					},
				},
			},
		},
	},

	[`socket.emit("${Events.send_reply_for_comment}")`]: {
		post: {
			tags: ["Комментарии"],
			summary: "Отправить ответ на комментарий",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: BodySendReplyToCommentSwaggerDoc,
					},
				},
			},
			responses: {
				error: getErrorSwaggerDoc(
					`Ошибка отправки ответа на комментарий через on('${Events.error}')`,
				),
			},
		},
	},

	[`socket.on("${Events.send_reply_for_comment}")`]: {
		get: {
			tags: ["Комментарии"],
			summary: "Получить ответ на комментарий",
			security: [{ bearerAuth: [] }],
			requestBody: {
				content: {
					"application/json": {
						schema: BodySendReplyToCommentSwaggerDoc,
					},
				},
			},
			responses: {
				200: {
					description:
						"Информация по отвеченному комментарию и информация по самому комментарию который был написан",
					content: {
						"application/json": {
							schema: ViewSendReplyToCommentSwaggerDoc,
						},
					},
				},
			},
		},
	},

	"/api/comments/count": {
		post: {
			tags: ["Комментарии"],
			security: [{ bearerAuth: [] }],
			summary: "Получить количество комментариев",
			requestBody: {
				content: {
					"application/json": {
						schema: BodyCommentsCountSwaggerDoc,
					},
				},
			},
			responses: {
				200: {
					description: "Количество комментариев успешно получено",
					content: {
						"application/json": {
							schema: ViewCommentsCountSwaggerDoc,
						},
					},
				},
				error: getErrorSwaggerDoc("Ошибка получения количества комментариев"),
			},
		},
	},
};

const getRoomId = (data: BodyJoinRoom) => {
	return `${data.ticketId}_${data.questionId}`;
};

export const commentsSocket = (socket: Socket) => {
	const { userId } = socket;
	if (!userId) return;

	socket.on(Events.join_room, (data: BodyJoinRoom) => {
		const roomId = getRoomId(data);
		if (socket.currentRoom) {
			console.log("Клиент покинул комнату: ", roomId);
			socket.leave(socket.currentRoom);
		}
		console.log("Клиент подключился к комнате: ", roomId);
		socket.join(roomId);
		socket.currentRoom = roomId;
		commentsNamespace.to(socket.currentRoom).emit(Events.join_room, { roomId });
	});

	socket.on(Events.send_comment, async (data: BodySendComment) => {
		console.log(Events.send_comment);
		await commentsController.sendComment(socket, userId, data);
	});

	socket.on(Events.send_reply_for_comment, async (data: BodySendComment) => {
		console.log(Events.send_reply_for_comment);
		await commentsController.sendReplyToComment(socket, userId, data);
	});

	socket.on(Events.get_all_comments, async (data: BodySendAllComments) => {
		console.log(Events.get_all_comments);
		await commentsController.getAllComments(socket, userId, data);
	});

	socket.on(Events.delete_comment, async (data: BodyDeleteComment) => {
		console.log(Events.delete_comment);
		await commentsController.deleteComment(socket, userId, data);
	});

	socket.on(Events.like_comment, async (data: BodyLikeComment) => {
		console.log(Events.like_comment);
		await commentsController.likeComment(socket, userId, data);
	});

	socket.on(Events.dislike_comment, async (data: BodyDislikeComment) => {
		console.log(Events.dislike_comment);
		await commentsController.dislikeComment(socket, userId, data);
	});

	socket.on("disconnect", () => {
		console.log("Клиент отключился:", socket.id);
		socket.leave(socket.currentRoom);
		socket.currentRoom = "";
	});
};

export const commentsRouter = () => {
	const router = express.Router();
	router.post("/count", checkAuth, commentsController.getCommentsCount);
	return router;
};
