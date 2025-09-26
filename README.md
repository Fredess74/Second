# Fetch Squads MVP

## Шаг 0. Настройка окружения на Windows
1. **Установите Node.js** с сайта [https://nodejs.org/](https://nodejs.org/). Проверьте установку командой `node -v` в новой консоли PowerShell.
2. **Создайте проект React на базе Vite**:
   ```bash
   npm create vite@latest fetch-squads-mvp -- --template react
   ```
3. **Перейдите в директорию проекта и установите зависимости**:
   ```bash
   cd fetch-squads-mvp
   npm install firebase react-router-dom tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```
4. **Настройте `tailwind.config.js`** — добавьте пути к файлам исходников:
   ```js
   export default {
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   };
   ```
5. **Создайте проект в [Firebase Console](https://console.firebase.google.com/)**:
   - Добавьте Web App и скопируйте настройки Firebase (они понадобятся в `src/firebase/config.js`).
   - Включите **Authentication** с методом Email/Password.
   - Создайте **Cloud Firestore** в режиме production или тестовом (на ваше усмотрение).
6. **Установите Firebase CLI и инициализируйте сервисы**:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init firestore
   firebase init functions
   ```
   При инициализации выберите существующий проект, укажите использование JavaScript для функций и разрешите установку зависимостей.

## Переменные окружения
Создайте файл `.env` в корне проекта и заполните его значениями из Firebase Console:
```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_CLOUD_FUNCTIONS_BASE_URL=https://us-central1-<ваш-project-id>.cloudfunctions.net
```
При локальном запуске функций через `firebase emulators:start` замените `VITE_CLOUD_FUNCTIONS_BASE_URL` на URL эмулятора, например `http://localhost:5001/<ваш-project-id>/us-central1`.

## Шаг 8. Финальные команды запуска
- Деплой облачных функций: `firebase deploy --only functions`
- Запуск локального сервера разработки: `npm run dev`

Прототип будет доступен по адресу [http://localhost:5173](http://localhost:5173) в любом современном браузере и на любой ОС.
