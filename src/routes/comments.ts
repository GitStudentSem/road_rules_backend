import type { Socket } from "socket.io";
import { DBError } from "../controllers/DBError";
import { getErrorSwaggerDoc } from "../assets/getErrorSwaggerDoc";
import {
	BodyDeleteCommentSwaggerDoc,
	BodyJoinRoomSwaggerDoc,
	BodySendAllCommentsSwaggerDoc,
	BodySendCommentSwaggerDoc,
	ViewDeleteCommentSwaggerDoc,
	ViewSendAllCommentsSwaggerDoc,
	ViewSendCommentSwaggerDoc,
} from "../types/controllers/commentsController";
import type {
	BodyDeleteComment,
	BodyJoinRoom,
	BodySendAllComments,
	BodySendComment,
} from "../types/controllers/commentsController";
import { defaultSwaggerValues } from "../assets/settings";
import { commentsController } from "../controllers/commentsController";
import { commentsNamespace } from "..";

export enum Events {
	error = "error",
	join_room = "join_room",
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
	[`/api/comments/${Events.join_room}`]: {
		post: {
			tags: ["Комментарии"],
			summary: "Подключится к комнате для комментариев",
			security: [{ bearerAuth: [] }],
			description: `Клиент подключатся к комнате через событие emit('${Events.join_room}')`,
			requestBody: {
				content: {
					"application/json": {
						schema: BodyJoinRoomSwaggerDoc,
					},
				},
			},
		},
	},

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

const getRoomId = (data: BodyJoinRoom) => {
	return `${data.ticketId}_${data.questionId}`;
};

export const commentsRouter = (socket: Socket) => {
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
		await commentsController.sendComment(socket, userId, data);
	});

	socket.on(Events.get_all_comments, async (data: BodySendAllComments) => {
		await commentsController.getAllComments(socket, userId, data);
	});

	socket.on(Events.delete_comment, async (data: BodyDeleteComment) => {
		await commentsController.deleteComment(socket, userId, data);
	});
	//
	socket.on("disconnect", () => {
		console.log("Клиент отключился:", socket.id);
		socket.leave(socket.currentRoom);
		socket.currentRoom = "";
	});
};
