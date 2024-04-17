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
  body: JSON.stringify({
    email: 'your_email@yandex.ru',
	  firstName: "your_firstname",
	  secondName: "your_secondname",
	  password: "your_password",
  });
});
```

### Ответ

- В случае успеха:

  ```typescript
  {email: string, firstName: string, secondName: string, _id: string }
  ```

- В случае провала:

  ```typescript
  {
    message: string;
  }
  ```

## Логин - http://localhost:3333/auth/login

### Запрос

```javascript
fetch("http://localhost:3333/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
	  email: 'your_email@yandex.ru' ,
	  password: "your_password",
  });
});
```

### Ответ

- В случае успеха:

  ```typescript
  { firstName: string, secondName: string,token: string }
  ```

- В случае провала:

  ```typescript
  {
    message: string;
  }
  ```

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
  body: JSON.stringify([1, 2, 4, 3 /*...*/]), // Ваши ответы
});
```

### Ответ

- В случае успеха:

  ```typescript
  { result: boolean, correctAnswers: number[] }
  ```

  `correctAnswers` - Массив правильных ответов

- В случае провала:

  ```typescript
  {
    message: string;
  }
  ```

## Отправить экзамен - http://localhost:3333/check/exam

### Запрос

```javascript
fetch("http://localhost:3333/check/exam", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`, // token - полученный после логина
    "Content-Type": "application/json",
  },
  body: JSON.stringify([
    { ticket: 1, question: 1, answer: 1 },
    { ticket: 2, question: 4, answer: 2 },
    { ticket: 3, question: 13, answer: 4 },
    { ticket: 2, question: 10, answer: 1 },
    /*...*/
  ]), // Ваши ответы
});
```

### Ответ

- В случае успеха:

  ```typescript
  { result: boolean,correctAnswers: number[] }
  ```

  `correctAnswers` - Массив правильных ответов

- В случае провала:

  ```typescript
  {
    message: string;
  }
  ```
