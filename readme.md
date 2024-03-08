# Сервер для ПДД тестирования

## Запуск

- Установите зависимости npm i
- Запустите сборку введя в терминале `npm run dev`

Сборка будет автоматически обновляться при каждом сохранени

## Регистрация - http://localhost:3333/auth/register

### Запрос

- `body: {"email": string, "password": string}`
- `headers: {"Content-Type": "application/json"}`

### Ответ

- В случае успеха:
  `{
	"email": string,
	"_id": string,
	"token": string
}`
- В случае провала:
  `{
	"message": string
}`

## Логин - http://localhost:3333/auth/login

### Запрос

- `body: {"email": string, "password": string}`
- `headers: {"Content-Type": "application/json"}`

### Ответ

- В случае успеха:
  `{
	"email": string,
	"_id": string,
	"token": string
}`
- В случае провала:
  `{
	"message": string
}`

## Отправить билет - http://localhost:3333/check/ticket/:ticketNumber

### Запрос

- `body: number[]`
- `headers: {Authorization: Bearer ${token}, "Content-Type": "application/json"}`

### Ответ

- В случае успеха:
  `{
	result: boolean,
	correctAnswers: number[]
}`
- В случае провала:
  `{
	"message": string
}`

## Отправить экзамен - http://localhost:3333/check/exam

### Запрос

- `body: { ticket: number, question: number, answer: number }[]`
- `headers: {Authorization: Bearer ${token}, "Content-Type": "application/json"}`

### Ответ

- В случае успеха:
  `{
	result: boolean,
	correctAnswers: number[]
}`
- В случае провала:
  `{
	"message": string
}`
