import { app } from "./app";

const port = process.env.PORT || 3333;

app.listen(port, () => {
	const colors = {
		black: "\x1b[30m",
		red: "\x1b[31m",
		green: "\x1b[32m",
		yellow: "\x1b[33m",
		blue: "\x1b[34m",
		whiteblue: "\x1b[36m",
		white: "\x1b[37m",
	};

	const styles = {
		bold: "\x1b[1m",
		italic: "\x1b[3m",
		underlined: "\x1b[4m",
		flickering: "\x1b[5m",
		hidden: "\x1b[8m",
		shading: "\x1b[2m",
	};

	const resetStyle = "\x1b[0m";

	console.log(`${colors.green}${styles.bold}Server OK${resetStyle}`);

	console.log(
		`Адрес сервера: ${colors.whiteblue}http://localhost:${port}${resetStyle}`,
	);
});
