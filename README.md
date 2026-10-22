# Task-Flow &mdash; Personal Task Manager

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1.svg?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Tests](https://img.shields.io/badge/Tests-Passing%20(9%2F9)-success.svg)](https://docs.pytest.org)

**Task-Flow** is a modern, responsive personal task management application built with a **React** frontend, a **FastAPI** REST backend, and persistent storage via **MySQL** (using **SQLAlchemy 2.0 ORM**).

This project fulfills all required specifications and bonus objectives of the *Full-Stack Developer Assignment*, emphasizing clean architecture, correct HTTP status codes, robust input validation, and a setup time under 10 minutes.

---

## 🗄️ Database Schema

The database strictly conforms to Section 4 of the specification:

### Table: `tasks`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | `INTEGER` | Primary key, auto-generated |
| `title` | `VARCHAR(255)` | Required, not null |
| `description` | `TEXT` | Optional, nullable |
| `status` | `VARCHAR(20)` | `'pending'` \| `'completed'` (default: `'pending'`) |
| `created_at` | `TIMESTAMP` | Set automatically on insert |
| `updated_at` | `TIMESTAMP` | Updated on every change |

---

## 🌟 Key Features

### Core Requirements
- **View All Tasks**: Displays title, optional description, status badge (`Pending` / `Completed`), and creation timestamp.
- **Add Task**: Fast task creation form with instant frontend validation. Submissions save to the database via API.
- **Toggle Status**: Instant toggle between `Pending` and `Completed` with a single click or round checkbox.
- **Edit Task**: Comprehensive modal for updating title, description, and status.
- **Delete Task**: Permanently removes tasks from the database with an accessible confirmation dialog.
- **Input Validation**: Prevents blank titles on both client and server; backend rejects invalid inputs with **HTTP 400 Bad Request**.
- **Visual Differentiation**: Completed tasks display strikethrough text and distinct badge colors.
- **Responsive Layout**: Designed with pure custom CSS (Flexbox & Grid), without relying on heavy frameworks.

### Bonus / Extra Credit Features
- [x] **Filter Bar**: Dynamic filtering between **All**, **Pending**, and **Completed** with live count badges.
- [x] **Backend Unit Tests**: Comprehensive test suite with 9 pytest cases covering CRUD, filtering, validation, and error codes.
- [x] **Live Search**: Quick client-side search across task titles and descriptions.

---

## 📂 Project Structure

```text
task-flow/
├── backend/
│   ├── app/
│   │   ├── crud/                # Database query operations
│   │   │   └── task.py
│   │   ├── models/              # SQLAlchemy ORM models (exact 6 columns)
│   │   │   └── task.py
│   │   ├── routes/              # REST API endpoints
│   │   │   └── task.py
│   │   ├── schemas/             # Pydantic validation schemas
│   │   │   └── task.py
│   │   ├── config.py            # Environment & database configuration
│   │   ├── database.py          # Engine, session, and table initialization
│   │   └── main.py              # FastAPI app, CORS, and validation error handler
│   ├── tests/
│   │   └── test_tasks.py        # Pytest test cases (9 passing tests)
│   ├── schema.sql               # MySQL DDL schema & sample seed data
│   ├── run.py                   # Server startup script
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example             # Backend environment template
│   └── .env                     # Local environment settings
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx     # Task creation form
│   │   │   ├── TaskList.jsx     # Task card list container
│   │   │   ├── TaskItem.jsx     # Individual task card
│   │   │   ├── FilterBar.jsx    # Filter tabs & search
│   │   │   ├── EditModal.jsx    # Edit task dialog
│   │   │   ├── ConfirmModal.jsx # Delete confirmation prompt
│   │   │   └── Toast.jsx        # Notification toasts
│   │   ├── services/
│   │   │   └── api.js           # Axios API client
│   │   ├── App.jsx              # Main React state & layout
│   │   ├── index.css            # Custom responsive stylesheet
│   │   └── main.jsx             # React entry point
│   ├── .env.example             # Frontend environment template
│   ├── .env                     # Local environment settings
│   └── package.json
│
└── README.md                    # Setup and architecture documentation
```

---

## 🛠️ Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18+` (Tested on `v24.19.0`) and `npm`
- **Python**: `3.10+` (Tested on `3.14.7`)
- **MySQL**: `8.0+` (or see [Zero-Config Fallback](#zero-config-database-fallback) below)

---

## 🚀 Quick Setup & Run Instructions (< 5 Minutes)

### 1. Database Setup (MySQL)

Create the MySQL database using MySQL CLI or phpMyAdmin/Workbench:

```sql
CREATE DATABASE task_flow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

*(Optional)* You can run the included `backend/schema.sql` to initialize the table with sample tasks:
```bash
mysql -u root -p task_flow_db < backend/schema.sql
```

> #### 💡 Zero-Config Database Fallback
> If you don't have a local MySQL server running and want to evaluate the project immediately, the backend includes an automatic fallback:
> - In `backend/.env`, set `USE_SQLITE=true`.
> - The application will persist to a local SQLite database (`tasks.db`) without requiring MySQL credentials.

---

### 2. Backend Setup (FastAPI)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   - **Windows**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **Linux / macOS**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   Copy `.env.example` to `.env` (already preconfigured with sensible defaults):
   ```bash
   cp .env.example .env
   ```

5. Run the backend server:
   ```bash
   python run.py
   ```
   *The API will start at `http://localhost:8000` with interactive Swagger docs at `http://localhost:8000/docs`.*

---

### 3. Frontend Setup (React + Vite)

1. Open a second terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The application will be live at `http://localhost:5173`.*

---

## 🧪 Running Backend Unit Tests

The backend includes a dedicated unit test suite using **pytest** and in-memory isolated database engines.

Run tests from the root or `backend/` directory:
```bash
# Windows
.\backend\venv\Scripts\pytest.exe backend/tests -v

# Linux / macOS
pytest backend/tests -v
```

---

## 📡 REST API Reference

All responses return standard `application/json` bodies and accurate status codes.

| Method | Endpoint | Description | Request Body | Status Codes |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/tasks` | Get all tasks (supports `?status=pending\|completed`) | None | `200` |
| `POST` | `/api/tasks` | Create new task | `{"title": str, "description": str?}` | `201`, `400` |
| `GET` | `/api/tasks/{id}` | Get task details by ID | None | `200`, `404` |
| `PUT` | `/api/tasks/{id}` | Update title, description, or status | `{"title": str?, "description": str?, "status": str?}` | `200`, `400`, `404` |
| `PATCH` | `/api/tasks/{id}/toggle` | Toggle between `pending` and `completed` | None | `200`, `404` |
| `DELETE` | `/api/tasks/{id}` | Permanently delete task | None | `200`, `404` |
| `GET` | `/api/health` | Health check endpoint | None | `200` |
