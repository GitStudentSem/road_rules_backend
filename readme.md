# Сервер для ПДД тестирования

## Запуск

- Установите зависимости `npm i`
- Запустите сборку введя в терминале `npm run dev`

Сборка будет автоматически обновляться при каждом сохранени

## Регистрация - http://localhost:3333/auth/register

### Запрос

```javascript
fetch("http://localhost:3333/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: { email: "<your_email@mail.com>", password: "<your_password>" },
});
```

### Ответ

- В случае успеха:

  `{ email: string, _id: string,token: string }`

- В случае провала:

  `{ message: string }` - Сообщение об ошибке

## Логин - http://localhost:3333/auth/login

### Запрос

```javascript
fetch("http://localhost:3333/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: { email: "<your_email@mail.com>", password: "<your_password>" },
});
```

### Ответ

- В случае успеха:

  `{ email: string,_id: string,token: string }`

- В случае провала:

  `{ message: string }` - Сообщение об ошибке

## Отправить билет - http://localhost:3333/check/ticket/:ticketNumber

`ticketNumber` - Порядковый номер билета

### Запрос

```javascript
fetch("http://localhost:3333/check/ticket/2", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`, // token - полученный после логина
    "Content-Type": "application/json",
  },
  body: [1, 2, 4, 3 /*...*/], // Ваши ответы
});
```

### Ответ

- В случае успеха:

  `{ result: boolean, correctAnswers: number[] }`
  `correctAnswers` - Массив правильных ответов

- В случае провала:

  `{ message: string }` - Сообщение об ошибке

## Отправить экзамен - http://localhost:3333/check/exam

### Запрос

```javascript
fetch("http://localhost:3333/check/exam", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`, // token - полученный после логина
    "Content-Type": "application/json",
  },
  body: [
    { ticket: 1, question: 1, answer: 1 },
    { ticket: 2, question: 4, answer: 2 },
    { ticket: 3, question: 13, answer: 4 },
    { ticket: 2, question: 10, answer: 1 },
    /*...*/
  ], // Ваши ответы
});
```

### Ответ

- В случае успеха:

  `{ result: boolean,correctAnswers: number[] }`
  `correctAnswers` - Массив правильных ответов

- В случае провала:

  `{ message: string }` - Сообщение об ошибке
