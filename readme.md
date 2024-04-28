# Сервер для ПДД тестирования

## Запуск

- Установите зависимости `npm i`

## Для режима разработчика (наблюдение за изменениями)
- `npm run ts-w` - Запускает сборку TypeScript в режиме наблюдения за изменениями
- `npm run build-w`- Запускает сборку JavaScript в режиме наблюдения за изменениями

Сборка будет автоматически обновляться при каждом сохранени

## Для статичной сборки (продакшен)
- `npm run ts` - Запускает разовую сборку TypeScript
- `npm run build` - Запускает разовую сборку JavaScript

Сборка НЕ будет автоматически обновляться при каждом сохранени

## Для запуска тестов
- `npm run test` - Запускает e2e все тесты
- `npm run test-register` - Запускает e2e тесты для регистрации
- `npm run test-login` - Запускает e2e тесты для логина
- `npm run test-ticket` - Запускает e2e тесты для билета
- `npm run test-exam` - Запускает e2e тесты для экзамена

Запуск необходимо производить без других поднятых вотчеров

## Подъем mongodb базы локально
- Инфомация взята из [22 урока по бекенду](https://www.youtube.com/watch?v=M4SUZlgnydA&list=PLcvhF2Wqh7DP4tZ851CauQ8GqgqlCocjk&index=22&ab_channel=YouTubeViewers) 

- Скачать установщик по [ссылке](https://www.mongodb.com/try/download/community)
- Разархивировть в нужное место
### Для macOS
- В папке с mongoDB (или где вам это нужно) создать папки data/db
- В терминале открыть разархивированную папку
- Запустить команду `./mongod --dbpath ./data/db`
- Для дальнейших запусков можно использовать `./mongod`

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
  { message: string; }
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
  { message: string; }
  ```

## Получить количество билетов - http://localhost:3333/tickets/count

### Запрос

```javascript
fetch("http://localhost:3333/tickets/count", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`, // token - полученный после логина
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
  { message: string; }
  ```

## Получить вопросы по билету - http://localhost:3333/tickets/:ticketNumber

`ticketNumber` - Порядковый номер билета

### Запрос

```javascript
fetch("http://localhost:3333/tickets/2", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`, // token - полученный после логина
  },
});
```

### Ответ

- В случае успеха:

  ```typescript
  { img: string, question: string, answers: string[] }[]
  ```

  `img` - Base64 строка

- В случае провала:

  ```typescript
  { message: string; }
  ```

## Отправить ответ на вопрос - http://localhost:3333/tickets/:ticketNumber

`ticketNumber` - Порядковый номер билета

### Запрос

```javascript
fetch("http://localhost:3333/tickets/2", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // token - полученный после логина
  },
  body: JSON.stringify({ 
    userAnswer: 2, // Порядковый номер ответа
    questionNumber: 1 // Порядковый номер вопроса
    }),
});
```

### Ответ

- В случае успеха:

  ```typescript
  { isCorrect: boolean correctAnswer: number, help: string }
  ```

- В случае провала:

  ```typescript
  { message: string; }
  ```

## Получить экзамен - http://localhost:3333/exam

`ticketNumber` - Порядковый номер билета

### Запрос

```javascript
fetch("http://localhost:3333/exam", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`, // token - полученный после логина
  },
});
```

### Ответ

- В случае успеха:

  ```typescript
  { img: string, 
  question: string, 
  answers: string[], 
  ticketNumber: number 
  }[]
  ```

- В случае провала:

  ```typescript
  {  message: string; }
  ```

  ## Отправить ответ на вопрос по экзамену - http://localhost:3333/exam/:ticketNumber

`ticketNumber` - Порядковый номер билета

### Запрос

```javascript
fetch("http://localhost:3333/exam/2", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // token - полученный после логина
  },
  body: JSON.stringify({ 
    userAnswer: 2, // Порядковый номер ответа
    questionNumber: 1 // Порядковый номер вопроса
    }),
});
```

### Ответ

- В случае успеха:

  ```typescript
  { isCorrect: boolean, correctAnswer: number, help: string }
  ```

- В случае провала:

  ```typescript
  {  message: string; }
  ```