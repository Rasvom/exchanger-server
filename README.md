<div align="center">
  <h1>🚀 Exchanger Server</h1>
  <p>Бэкенд для платформы обмена криптовалют</p>
  
  [![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
</div>

## 📋 Возможности

- 🔒 Аутентификация и авторизация (JWT)
- 💱 Торговые операции с криптовалютами
- 📊 Админ-панель для управления
- 📱 REST API + WebSocket
- 📄 Документация Swagger
- 🐳 Готовность к Docker-развертыванию

## 🚀 Быстрый старт

1. Клонируйте репозиторий:
   ```bash
   git clone <repository-url>
   cd exchanger-server
   ```

2. Установите зависимости:
   ```bash
   npm install
   ```

3. Настройте переменные окружения:
   ```bash
   cp .env.example .env
   # Отредактируйте .env файл
   ```

4. Запустите сервер разработки:
   ```bash
   npm run dev
   ```

## 🔧 Технологии

- **Node.js** - JavaScript-рантайм
- **TypeScript** - Статическая типизация
- **MongoDB** - База данных
- **Socket.IO** - Веб-сокеты
- **Jest** - Тестирование
- **Docker** - Контейнеризация

## 📦 Переменные окружения

```env
# Основные настройки
PORT=3000
NODE_ENV=development

# База данных
MONGODB=mongodb://localhost:27017/exchanger

# JWT
SECRET_ACCESS_JWT=your_access_secret
SECRET_REFRESH_JWT=your_refresh_secret

# URL фронтендов
FRONTEND_URL=http://localhost:5173
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

## 🛠 Доступные команды

- `dev` - Запуск сервера разработки
- `build` - Сборка для продакшена
- `start` - Запуск продакшн-сборки
- `test` - Запуск тестов
- `lint` - Проверка кода
- `format` - Форматирование кода

## 🐳 Запуск в Docker

```bash
docker-compose up -d
```

## 📚 Документация API

После запуска сервера:
- Swagger UI: http://localhost:3000/api-docs
- Health Check: http://localhost:3000/health

## 🏗 Структура проекта

```
src/
├── config/       # Конфигурация приложения
├── controllers/  # Контроллеры API
├── middlewares/  # Промежуточное ПО
├── models/       # Модели данных
├── routes/       # Маршруты API
├── services/     # Бизнес-логика
└── utils/        # Вспомогательные функции
```

## 📄 Лицензия

MIT © [Rasvom](https://github.com/Rasvom)
