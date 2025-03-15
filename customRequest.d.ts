import { Request } from "express";
import "socket.io";
import type { DefaultEventsMap } from "socket.io/dist/typed-events";

declare module "express-serve-static-core" {
	interface Request {
		userId?: string;
	}
}

declare module "socket.io" {
	interface Socket<
		ListenEvents extends DefaultEventsMap = DefaultEventsMap,
		EmitEvents extends DefaultEventsMap = DefaultEventsMap,
		ServerSideEvents extends DefaultEventsMap = DefaultEventsMap,
		SocketData = any,
	> {
		userId?: string; // Добавляем поле userId
	}
}
