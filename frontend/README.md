# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


<!-- 
frontend/
└── src/
    ├── components/
    │   ├── Navbar.jsx
    │   └── ProtectedRoute.jsx
    │
    ├── context/
    │   └── AuthContext.jsx
    │
    ├── pages/
    │   ├── LoginPage.jsx
    │   ├── DashboardPage.jsx
    │   ├── AttendancePage.jsx
    │   └── ReportsPage.jsx
    │
    ├── services/
    │   └── api.js
    │
    ├── App.jsx
    ├── main.jsx
    └── index.css -->



<!-- 
                     ATTENDANCE SaaS
                       │
              ┌────────┴────────┐
              │                 │
           FRONTEND           BACKEND
           React              Node/Express
           Vite               MongoDB
           Tailwind           JWT
              │                 │
              └────────┬────────┘
                       │
                    LOGIN
                       │
                    JWT
                       │
             ┌─────────┴─────────┐
             │         │         │
           ADMIN    TEACHER      CR
             │         │         │
             └─────────┼─────────┘
                       │
                 CLASS / SUBJECT
                       │
                    STUDENTS
                       │
                 ATTENDANCE
                       │
                  REPORTS
                       │
              ┌────────┴────────┐
              │                 │
            Excel              PDF -->