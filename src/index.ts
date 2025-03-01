import { app } from "./app";
import { colors, resetStyle, styles } from "./assets/logStyles";
import { runDb } from "./repositories/db";
import swaggerDocs from "./assets/swagger";
import { Server } from "socket.io";
import http from "node:http";

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*", // Разрешаем все источники (или укажите конкретные домены)
		methods: ["GET", "POST"],
	},
});
const ticketCommentsNamespace = io.of("/api/tickets/comments");
// Обработка подключения клиента
ticketCommentsNamespace.on("connection", (socket) => {
	console.log("Пользователь подключился:", socket.id);

	socket.on("send-comment", (data) => {
		console.log("Новый комментарий:", data);
		ticketCommentsNamespace.emit("new-comment", data);
	});

	socket.on("disconnect", () => {
		console.log("Пользователь отключился:", socket.id);
	});
});

const port = process.env.PORT || 3333;

const startApp = async () => {
	try {
		console.log("port", port);
		await runDb();

		server.listen(port, () => {
			swaggerDocs(app, +port);
			console.log(`${colors.green}${styles.bold}Server OK${resetStyle}`);

			console.log(
				`Адрес сервера: ${colors.whiteblue}http://localhost:${port}${resetStyle}`,
			);

			console.log(
				`Адрес документации: ${colors.whiteblue}http://localhost:${port}/api/docs${resetStyle}`,
			);
		});
	} catch (error) {
		console.log("error", error);
	}
};
startApp();
//
