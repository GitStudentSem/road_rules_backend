import { app } from "./app";
import { colors, resetStyle, styles } from "./assets/logStyles";
import { runDb } from "./repositories/db";
import swaggerDocs from "./assets/swagger";
import { Server } from "socket.io";
import http from "node:http";
import { commentsSocket } from "./routes/comments";
import jwt from "jsonwebtoken";
import { settings } from "./assets/settings";

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});
export const commentsNamespace = io.of("/api/comments");
// Middleware для проверки токена
commentsNamespace.use(async (socket, next) => {
	// const token = null;
	const token = socket.handshake.query.token;

	try {
		if (!token) {
			return next(new Error("Токен не был передан"));
		}

		// Проверка токена
		const decoded = jwt.verify(token, settings.JWT_SECRET);

		socket.userId = decoded.userId;
		next();
	} catch (error) {
		if (error instanceof Error) {
			return next(new Error("Токен не валиден или истек"));
		}
	}
});

// Подключаем маршруты сокета
commentsNamespace.on("connection", (socket) => {
	console.log("Клиент подключился для комментариев:", socket.id);
	commentsSocket(socket);
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
