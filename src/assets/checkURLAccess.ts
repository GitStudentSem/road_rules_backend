import type { NextFunction, Request, Response } from "express";
import { HTTP_STATUSES } from "../utils";

const tgLink = "(telegram: @semyon_purnemtzev)";
//activeUntill: year, month, date,
const serverWillDeadAt = new Date(2024, 9, 0);
const allowedReferers = [
	{ url: "localhost", activeUntill: serverWillDeadAt },
	{ url: "road-rules-backend", activeUntill: serverWillDeadAt },
];

export const checkURLAccess = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const host = req.get("Host");
	console.log("host", host);
	if (!host) {
		res
			.status(HTTP_STATUSES.FORRIBDEN_403)
			.send(
				`У вас отсутсвует заголовок host, он необходим для выполнения запроса, попробуйте обратиться к администратору ${tgLink}`,
			);
		return;
	}

	const refererEntry = allowedReferers.find((entry) =>
		host.startsWith(entry.url),
	);

	if (!refererEntry) {
		res
			.status(HTTP_STATUSES.FORRIBDEN_403)
			.send(
				`Ваш адрес: ${host} не включен в список разрешенных адресов этого сервера, пожалуйста обратитесь к администратору ${tgLink}`,
			);
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

		res
			.status(HTTP_STATUSES.FORRIBDEN_403)
			.send(
				`Срок оплаты сервера для этого адреса: ${host} истек ${formattedDate}, вы можете оплатить его снова и вернуть себе доступ, попробуйте обратиться к администратору ${tgLink}`,
			);
		return;
	}

	next();
};
