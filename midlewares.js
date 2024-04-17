import { validationResult } from "express-validator";

import jwt from "jsonwebtoken";
import { sendError } from "./assets/requestAssets.js";

export const checkAuth = (req, res, next) => {
	const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

	if (token) {
		try {
			const decoded = jwt.verify(token, "somthingStrangeString");

			req.userId = decoded._id;
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
		return res.status(403).json({ message: "Токен доступа не был получен" });
	}
};

export const handleValudationErrors = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const message = errors.array()[0].msg;
		return res.status(400).json({ message });
	}

	next();
};
