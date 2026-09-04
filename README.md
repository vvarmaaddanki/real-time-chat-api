 A V Varma: # 💬 Real-Time Chat Application

A full-stack *Real-Time Chat Application* built with *Django REST Framework* and a modern *Vite-based frontend*.

The application provides user authentication and a real-time chat interface, with a REST API backend designed to support communication between users.

---

## 🚀 Live Demo

### 🌐 Frontend
🔗 *Live Demo:* [http://localhost:5173/]

### ⚙️ Backend API
🔗 *API:* [http://127.0.0.1:8000/]

> Note: The live links will be added after deployment.

---

## 📌 Project Overview

The *Real-Time Chat Application* is a full-stack web application designed to provide users with a simple and responsive platform for authentication and real-time communication.

The project follows a separated frontend and backend architecture:

- *Frontend* handles the user interface and user interactions.
- *Backend* provides REST APIs, authentication, database management, and chat functionality.
- *Database* stores users, chat-related information, and application data.

---

## ✨ Features

### 🔐 User Authentication

- User registration
- User login
- Username and password authentication
- Protected application functionality

### 💬 Real-Time Chat

- Chat interface for users
- Real-time communication architecture
- Chat API endpoint
- Message handling through the backend

### 🔌 REST API

The backend exposes API endpoints for frontend communication.

Example endpoints:

```text
/api/
/api/chat/
 A V Varma: 🗄️ Database
The application is designed to work with PostgreSQL for persistent data storage.
🎨 Modern Frontend
The frontend is built using Vite, providing a fast development environment and modern frontend tooling.
🛠️ Tech Stack
Backend
Python
Django 5.2.8
Django REST Framework
Django Authentication
PostgreSQL
Django ORM
Frontend
JavaScript
Vite
HTML5
CSS3
npm
Development Tools
Git
GitHub
Git Bash
Visual Studio Code

🏗️ Project Architecture
Real-Time-Chat-Application/
│
├── backend/
│   ├── coreBackend/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── ...
│   │
│   ├── accounts/
│   ├── chat/
│   ├── manage.py
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
├── .gitignore
└── README.md
⚙️ Local Setup
Follow the steps below to run the project locally.
1️⃣ Clone the Repository
git clone https://github.com/vvarmaaddanki/real-time-chat-api.git
Move into the project:
cd Real-Time-Chat-Application

🐍 Backend Setup
2️⃣ Navigate to Backend
cd backend
3️⃣ Create Virtual Environment
python -m venv venv

Activate it on Windows:
source venv/Scripts/activate

4️⃣ Install Python Dependencies
pip install -r requirements.txt

5️⃣ Configure Environment Variables
Create a .env file inside the backend directory.
Example:
SECRET_KEY=your-secret-key
DEBUG=True

DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432
Never commit your real .env file or secret keys to GitHub.

6️⃣ Run Database Migrations
python manage.py migrate

7️⃣ Start Django Server
python manage.py runserver
The backend will run at:
http://127.0.0.1:8000/

⚛️ Frontend Setup
Open another terminal.

8️⃣ Navigate to Frontend
cd frontend

9️⃣ Install Node Dependencies
npm install
🔟 Start Vite Development Server
npm run dev
The frontend will run at:
http://localhost:5173/
🧪 Local Testing
Once both servers are running:
Backend
http://127.0.0.1:8000/
Frontend
http://localhost:5173/
Open the frontend URL in your browser.
You should see the Login page with:
Username
Password
Login button
New User / Register option
🔄 Application Flow
                 ┌─────────────────────┐
                 │       User          │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │      Frontend       │
                 │   Vite / JavaScript │
                 └──────────┬──────────┘
                            │
                     REST API Requests
                            │
                            ▼
                 ┌─────────────────────┐
                 │       Django        │
                 │   REST Framework    │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │     PostgreSQL      │
                 │      Database       │
                 └─────────────────────┘
🔐 Security
The project follows basic security practices such as:
Environment variables for sensitive configuration
Django authentication
Protected API functionality
.gitignore for sensitive/local files
Separate development and production configuration
For production deployment:
DEBUG=False
should be used and production environment variables should be configured securely

📊 API Endpoints
Method
Endpoint
Description
GET/POST
/api/
API root
GET/POST
/api/chat/
Chat functionality
Add additional endpoints here as the API grows.

🧑‍💻 Development
Start the backend:
cd backend
source venv/Scripts/activate
python manage.py runserver
Start the frontend in another terminal:
cd frontend
npm install
npm run dev

🚀 Deployment
The application can be deployed using a separate frontend and backend deployment architecture.
Frontend
The Vite frontend can be deployed using platforms such as:
Vercel
Netlify
Backend
The Django backend can be deployed using platforms such as:
Render
Railway
PythonAnywhere
Database
PostgreSQL can be hosted using:
Render PostgreSQL
Railway PostgreSQL
Supabase

🎯 Future Improvements
Planned improvements may include:
Online/offline user status
Typing indicators
Message timestamps
Read receipts
User profile management
Chat history
Group conversations
File and image sharing
Improved notifications
WebSocket-based communication
Production monitoring and logging

📚 Learning Outcomes
This project demonstrates practical experience with:
Django backend development
Django REST Framework
REST API development
User authentication
PostgreSQL database integration
Frontend and backend integration
Vite frontend development
Environment variable management
Git and GitHub
Full-stack application deployment

👨‍💻 Author
Your Name: ADDANKI VENKATESH VARMA
Backend Developer | Python | Django | Django REST Framework | PostgreSQL
GitHub
🔗 https://github.com/vvarmaaddanki
LinkedIn
🔗 https://www.linkedin.com/in/vvarmaaddanki/

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run tests and linting.
5. Submit a pull request.

---

## Contributor

*A V Varma*


