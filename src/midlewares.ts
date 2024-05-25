import { validationResult } from "express-validator";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "./assets/requestAssets";
import { HTTP_STATUSES } from "./utils";
import { settings } from "./assets/settings";

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
	const token: string = (req.headers.authorization || "").replace(
		/Bearer\s?/,
		"",
	);
	console.log("req.headers.authorization", req.headers.authorization);
	if (token) {
		try {
			const decoded = jwt.verify(token, settings.JWT_SECRET);
			console.log("decoded", decoded);
			//@ts-ignore
			req.userId = decoded.id;
			next();
		} catch (error) {
			sendError({
				status: 403,
				message: "Токен доступа неверен или истек",
				error,
				res,
			});
		}
	} else {
		return res
			.status(HTTP_STATUSES.FORRIBDEN_403)
			.json({ message: "Токен доступа не был получен" });
	}
};

export const handleValudationErrors = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const message = errors.array()[0].msg;
		return res.status(HTTP_STATUSES.BAD_REQUEST_400).json({ message });
	}

	next();
};
