
```
project-management-system
├─ backend-project
│  ├─ .prettierignore
│  ├─ .prettierrc
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  └─ images
│  └─ src
│     ├─ app.js
│     ├─ controller
│     │  ├─ dashboard.controller.js
│     │  ├─ healthcheck.controller.js
│     │  ├─ project.controller.js
│     │  ├─ task.controller.js
│     │  ├─ userAuth.controller.js
│     │  └─ workspace.controller.js
│     ├─ db
│     │  └─ mongodb-connection.js
│     ├─ index.js
│     ├─ middlewares
│     │  ├─ auth.midleware.js
│     │  ├─ fileUpload.middleware.js
│     │  └─ vlidators.middleware.js
│     ├─ models
│     │  ├─ note.model.js
│     │  ├─ project.model.js
│     │  ├─ projectMember.model.js
│     │  ├─ subTask.model.js
│     │  ├─ task.model.js
│     │  ├─ user.models.js
│     │  ├─ workspace.member.model.js
│     │  └─ workspace.model.js
│     ├─ routes
│     │  ├─ authUser.route.js
│     │  ├─ dashboard.route.js
│     │  ├─ healthcheck.route.js
│     │  ├─ projects.routes.js
│     │  ├─ task.route.js
│     │  └─ workspace.route.js
│     ├─ utils
│     │  ├─ api-error.js
│     │  ├─ api-response.js
│     │  ├─ asyn-handler.js
│     │  ├─ costants.js
│     │  └─ mail.js
│     └─ validators
│        └─ index.js
├─ frontend
│  ├─ dist
│  │  ├─ assets
│  │  │  ├─ index-BgxSUJSD.js
│  │  │  └─ index-i0CgWSz4.css
│  │  ├─ favicon.svg
│  │  ├─ icons.svg
│  │  └─ index.html
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ PRD.md
│  ├─ public
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.jsx
│  │  ├─ AppProvider.jsx
│  │  ├─ assets
│  │  ├─ components
│  │  │  ├─ AddmemberModal.jsx
│  │  │  ├─ auth
│  │  │  │  ├─ Authcomponents.jsx
│  │  │  │  ├─ Login.jsx
│  │  │  │  └─ Register.jsx
│  │  │  ├─ EditTaskModal.jsx
│  │  │  ├─ layout
│  │  │  │  ├─ DashboardLayout.jsx
│  │  │  │  └─ Sidebar.jsx
│  │  │  └─ TaskModal.jsx
│  │  ├─ context
│  │  │  └─ Projectscontext.jsx
│  │  ├─ index.css
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ Auth.jsx
│  │  │  ├─ Calendar.jsx
│  │  │  ├─ Dashboard.jsx
│  │  │  ├─ Inbox.jsx
│  │  │  ├─ MyTasks.jsx
│  │  │  ├─ ProjectDetails.jsx
│  │  │  ├─ ProjectsList.jsx
│  │  │  └─ setting
│  │  │     ├─ components
│  │  │     │  ├─ SettingCard.jsx
│  │  │     │  └─ SettingSidebar.jsx
│  │  │     ├─ sections
│  │  │     │  └─ GeneralSetting.jsx
│  │  │     ├─ setting.config.jsx
│  │  │     └─ Setting.jsx
│  │  ├─ Routes
│  │  │  └─ ProtectedRoutes.jsx
│  │  ├─ services
│  │  │  ├─ Api.js
│  │  │  └─ socket.js
│  │  └─ utils
│  └─ vite.config.js
├─ package-lock.json
└─ package.json

```