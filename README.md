## HomoTech — магазин билетов в кинотеатр с админ‑панелью
<img width="1862" height="953" alt="image" src="https://github.com/user-attachments/assets/fb029d89-df23-45af-9c57-5ac2df0d01fd" />

### Описание
Одностраничное приложение для продажи билетов в кинотеатр:
- каталог фильмов, афиша и расписание сеансов;
- выбор мест, корзина и оформление заказа с отправкой билетов на email;
- админ‑панель: аутентификация, добавление фильмов и сеансов, просмотр заказов.

Проект создан для практики стека React + NestJS + PostgreSQL, а также инфраструктуры на Docker. В процессе работы проработаны:
- API проектирование, защита админ‑эндпоинтов JWT‑токеном в заголовке `X-Admin-Token`;
- хранение данных в PostgreSQL через TypeORM;
- доставka email через Yandex SMTP и шаблон HTML‑письма;
- сборка и деплой фронтенда на Nginx, бэкенда на Node.js, общая оркестрация через docker‑compose.

### Стек
- Фронтенд: React 18, TypeScript, Vite, React Router, React Hook Form, SCSS
- Бэкенд: NestJS 10, TypeORM, PostgreSQL 15, JWT, Nodemailer
- Инфраструктура: Docker, Nginx, docker‑compose

### Основная функциональность
- Пользовательский интерфейс: лента фильмов, предпросмотр, расписание, выбор мест, корзина, оформление заказа
- Email‑квитанция: отправка письма с деталями заказа и суммой
- Админ‑панель: логин, создание фильма, создание сеанса, список заказов
- Публичный CDN статичных изображений фильмов

### API (префикс `api/afisha`)
- `GET /films` — список фильмов
- `GET /films/:id/schedule` — расписание выбранного фильма
- `POST /order` — оформить заказ, email с билетами уходит автоматически
- `POST /admin/auth` — вход в админку по паролю, ответ `{ access_token }`
- `GET /order/admin` — список заказов (требует `X-Admin-Token`)
- `POST /films/admin` — создать фильм (требует `X-Admin-Token`)
- `POST /films/admin/:id/schedule` — создать сеанс (требует `X-Admin-Token`)


### Системные требования
- Node.js 20+
- npm / pnpm / yarn
- Docker и Docker Compose 

### Переменные окружения
Пример и подсказки по заполнению находятся в файлах `backend/env.example` и `frontend/env.example`.

### Быстрый старт в Docker
```bash
docker-compose up -d --build
```
После сборки:
- фронтенд: http://localhost
- бэкенд API: http://localhost:3000/api/afisha
- PostgreSQL: localhost:5432
- pgAdmin: http://localhost:8080

Значения по умолчанию задаются в `docker-compose.yml` и подходят для локального запуска.
 

### Структура репозитория
- `frontend/` — клиент на React + Vite
- `backend/` — сервер на NestJS, префикс API `api/afisha`, статика по пути `/content/afisha`
- `nginx/` — конфигурация Nginx для прод‑сборки фронтенда
- `docker-compose.yml` — локальный запуск фронтенда, бэкенда, PostgreSQL и pgAdmin

### Статус проекта и планы
Текущий статус: функционал пользовательского потока и базовая админка реализованы


