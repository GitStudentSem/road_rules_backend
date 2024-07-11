import { colors, resetStyle } from "./logStyles";

export const logRoutes = (req, res, next) => {
	const path = req.path;

	if (!path.includes("api/") || path.includes("swagger")) return next();

	const now = new Date();
	const year = now.getFullYear();
	const month = `0${now.getMonth() + 1}`.slice(-2);
	const day = `0${now.getDate()}`.slice(-2);
	const hours = `0${now.getHours()}`.slice(-2);
	const minutes = `0${now.getMinutes()}`.slice(-2);

	const pathLog = `${colors.blue} ${path}${resetStyle}`;
	let methodLog = "";
	switch (req.method) {
		case "GET":
			methodLog = `${colors.blue}${req.method}${resetStyle}`;
			break;
		case "POST":
			methodLog = `${colors.green}${req.method}${resetStyle}`;
			break;
		case "DELETE":
			methodLog = `${colors.red}${req.method}${resetStyle}`;
			break;
		case "PATCH":
			methodLog = `${colors.cyan}${req.method}${resetStyle}`;
			break;
	}

	console.log(
		`Запрос на роут ${pathLog} с методом ${methodLog} ${day}/${month}/${year} в ${hours}:${minutes}`,
	);

	next();
};
