# Сервер для ПДД тестирования

## Запуск

- Установите зависимости `npm i`

## Необходимые env перменные:
- URL_CLOUD_DB - ссылка на базу данных mongodb
- ENTRY_POINT_FOR_S3 - ссылка на s3 хранилище
- ACCESS_KEY_ID_FOR_S3
- SECRET_ACCESS_KEY_FOR_S3 
- BUCKET_NAME_FOR_S3

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

## Документация API расположена по адресу:
  http://localhost:3333/api/docs


