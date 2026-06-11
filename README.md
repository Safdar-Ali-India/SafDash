# SafDash

Personal developer dashboard — GitHub activity, dev news, tasks, and a focus timer. Built with React, TypeScript, and Vite.

## Setup

```bash
npm install
npm run dev
```

Runs at [http://localhost:5173](http://localhost:5173).

```bash
npm run build
```

## What's included

- GitHub activity feed and profile stats for any public user
- Dev.to and Hacker News top stories
- Task list with priority filters (saved in localStorage)
- Clock with pomodoro timer
- Settings to change GitHub username, refresh interval, and which widgets show

Default GitHub username is `Safdar-Ali-India` — change it in settings.

## Stack

React 19, TypeScript, Vite, Tailwind CSS 4, Lucide icons.

GitHub REST API, Dev.to API, and Hacker News Firebase API for data.

## Structure

```
src/
├── components/   layout, widgets, ui
├── hooks/        data fetching and state
├── lib/          storage and formatting helpers
└── types/
```

MIT
