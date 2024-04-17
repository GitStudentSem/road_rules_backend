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

## Отправить билет - http://localhost:3333/check/tickets/:ticketNumber

`ticketNumber` - Порядковый номер билета

### Запрос

```javascript
fetch("http://localhost:3333/check/tickets/2", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`, // token - полученный после логина
    "Content-Type": "application/json",
  },
});
```

### Ответ

- В случае успеха:

  ```typescript
  { img: string, question: string, answers: string[], help: string }[]
  ```

  `correctAnswers` - Массив правильных ответов

- В случае провала:

  ```typescript
  {
    message: string;
  }
  ```

## Отправить экзамен - http://localhost:3333/tickets/count

### Запрос

```javascript
fetch("http://localhost:3333/tickets/count", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`, // token - полученный после логина
    "Content-Type": "application/json",
  }
});
```

### Ответ

- В случае успеха:

  ```typescript
  { ticketsCount: number }
  ```

- В случае провала:

  ```typescript
  {
    message: string;
  }
  ```
