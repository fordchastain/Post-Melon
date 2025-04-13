## Post Melon 🍉

![MIT License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-brightgreen)
![Last Commit](https://img.shields.io/github/last-commit/fordchastain/post-melon)
![Made with React](https://img.shields.io/badge/frontend-React-61DAFB?logo=react)
![Backend](https://img.shields.io/badge/backend-Express.js-000000?logo=express)
![TypeScript](https://img.shields.io/badge/language-TypeScript-3178C6?logo=typescript)

A lightweight, minimal, fully local, open-source API testing tool that runs entirely on your device and never stores data on any server. Your API request history, environments, and configurations stay local — giving you complete control over your data.

As more tools move to the cloud and lock features behind accounts and subscriptions, Post Melon brings things back to basics: core functionality, full privacy, and zero vendor lock-in.

## Tech Stack 💻

- Frontend: React TypeScript + Material UI + Emotion
- Backend: Express.js
- Database: SQLite3

## Features 🚀

- Send HTTP requests (GET, POST, PUT, DELETE, PATCH)
- Custom headers, query params, and request bodies
- No user login or authentication required — 100% local
- Keep track of request history with methods and URLs
- Formatted json response viewer
- Runs in browser (no desktop app needed)

![POST Request Example](/frontend/public/POST_Example.gif)

## Installation ⬇️

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Clone the project

```
git clone https://github.com/fordchastain/Post-Melon
cd post-melon
```

### Install frontend dependencies

```
cd frontend
npm install
```

### Install backend dependencies

```
cd ../backend
npm install
```

### Start backend server

```
cd backend
npm run dev
```

### Start react frontend (in a separate terminal)

```
cd frontend
npm run start
```

## Roadmap 🛣️

- Store templates to re-use requests
- Import/export templates
- Additional history info
- Websocket support
- GraphQL support
- UI color themes
- Enhanced security with encryption

## License 📃

This project is licensed under the [MIT License](./LICENSE).
