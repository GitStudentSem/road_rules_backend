import type { NextFunction, Request, Response } from "express";
import { HTTP_STATUSES } from "../utils";
import { sendError } from "./requestAssets";

const tgLink = "(telegram: @semyon_purnemtzev)";
//activeUntill: year, month, date,
const serverWillDeadAt = new Date(2024, 9, 0);
const allowedReferers = [
	{ url: "http://localhost:3333", activeUntill: serverWillDeadAt },
	{ url: "http://localhost:5173", activeUntill: serverWillDeadAt },
];

export const checkURLAccess = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const referer = req.get("Referer");

	if (!referer) {
		sendError({
			status: HTTP_STATUSES.FORRIBDEN_403,
			res,
			message: `У вас отсутсвует заголовок referer, он необходим для выполнения запроса, попробуйте обратиться к администратору ${tgLink}`,
		});
		return;
	}

	const refererEntry = allowedReferers.find((entry) =>
		referer.startsWith(entry.url),
	);

	if (!refererEntry) {
		sendError({
			status: HTTP_STATUSES.FORRIBDEN_403,
			res,
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

		sendError({
			status: HTTP_STATUSES.FORRIBDEN_403,
			res,
			message: `Срок оплаты сервера для этого адреса: ${referer} истек ${formattedDate}, вы можете оплатить его снова и вернуть себе доступ, попробуйте обратиться к администратору ${tgLink}`,
		});
		return;
	}

	next();
};

export const checkURLAccess1 = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const referer = req.get("Referer");

	if (referer) {
		const foundedLink = allowedReferers.find((allowedReferer) =>
			referer.startsWith(allowedReferer.url),
		);
		if (!foundedLink) {
			sendError({
				status: HTTP_STATUSES.FORRIBDEN_403,
				res,
				message: `Ваш адрес не включен в список разрешенных адресов этого сервера, пожалуйста обратитесь к администратору ${tgLink}`,
			});
		}
		if (foundedLink) {
			const dateOptions: Intl.DateTimeFormatOptions = {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			};

			const formattedDate = foundedLink.activeUntill.toLocaleDateString(
				"ru-RU",
				dateOptions,
			);

			if (foundedLink.activeUntill > new Date()) {
				next();
				return;
			}

			return sendError({
				status: HTTP_STATUSES.FORRIBDEN_403,
				res,
				message: `Срок оплаты сервера истек ${formattedDate}, вы можете оплатить его снова и вернуть себе доступ, попробуйте обратиться к администратору ${tgLink}`,
			});
		}
	} else {
		return sendError({
			status: HTTP_STATUSES.FORRIBDEN_403,
			res,
			message: `У вас отсутсвует заголовок referer, он необходим для выполнения запроса, попробуйте обратиться к администратору ${tgLink}`,
		});
	}
};
