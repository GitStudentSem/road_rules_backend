import type { NextFunction, Request, Response } from "express";
import { HTTP_STATUSES } from "../utils";
import { swaggerDocPath } from "./swagger";

const tgLink = "(telegram: @semyon_purnemtzev)";
//activeUntill: year, month, date,
const serverWillDeadAt = new Date(2024, 11, 0);
const allowedReferers = [
	{ url: "http://localhost", activeUntill: serverWillDeadAt },
	{ url: "http://road-rules-backend", activeUntill: serverWillDeadAt },
	{ url: "http://127.0.0.1", activeUntill: serverWillDeadAt },
];

export const checkURLAccess = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const referer = req.get("Referer");

	if (req.path.startsWith(swaggerDocPath)) {
		return next();
	}

	if (!referer) {
		res.status(HTTP_STATUSES.FORRIBDEN_403).send({
			message: `У вас отсутсвует заголовок referer, он необходим для выполнения запроса, попробуйте обратиться к администратору ${tgLink}`,
		});
		return;
	}

	const refererEntry = allowedReferers.find((entry) =>
		referer.startsWith(entry.url),
	);

	if (!refererEntry) {
		res.status(HTTP_STATUSES.FORRIBDEN_403).send({
			message: `Ваш адрес: ${referer} не включен в список разрешенных адресов этого сервера, пожалуйста обратитесь к администратору ${tgLink}`,
		});
		return;
	}

	if (refererEntry.activeUntill < new Date()) {
		const dateOptions: Intl.DateTimeFormatOptions = {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		};

		const formattedDate = refererEntry.activeUntill.toLocaleDateString(
			"ru-RU",
			dateOptions,
		);

		res.status(HTTP_STATUSES.FORRIBDEN_403).send({
			message: `Срок оплаты сервера для этого адреса: ${referer} истек ${formattedDate}, вы можете оплатить его снова и вернуть себе доступ, попробуйте обратиться к администратору ${tgLink}`,
		});
		return;
	}

	next();
};
