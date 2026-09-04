# Real-Time Chat Application

A full-stack chat application built with Django REST Framework for the backend and React for the frontend. This application allows users to register, login, send messages, and manage their contacts in a real-time manner using polling.

## Features

- **User Authentication**: Secure registration and login using JWT (JSON Web Tokens) with refresh token support.
- **Real-Time Messaging**: Send and receive messages with polling-based updates to simulate real-time chat.
- **Message Management**: View message history, mark messages as read, and fetch new messages after a specific ID.
- **User Blocking**: Block other users to prevent sending or receiving messages from them.
- **Contact Management**: View a list of all users and manage interactions.
- **Responsive UI**: Modern, responsive interface built with React, Bootstrap, and CSS.
- **Throttling**: Rate limiting on message sending and registration to prevent abuse.
- **CORS Support**: Configured for cross-origin requests, allowing frontend-backend communication.

## Tech Stack

### Backend
- **Django 5.2.8**: Web framework for building the API.
- **Django REST Framework**: For building RESTful APIs.
- **Simple JWT**: For token-based authentication.
- **SQLite**: Database.
- **Django CORS Headers**: To handle cross-origin requests.
- **Python-dotenv**: For environment variable management.

### Frontend
- **React 19.2.0**: JavaScript library for building the user interface.
- **Vite**: Build tool for fast development and bundling.
- **Axios**: HTTP client for API requests.
- **Bootstrap 5.3.8**: CSS framework for responsive design.
- **CSS**: CSS for styling.

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

## Installation and Setup

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   - Create a `.env` file in the `backend` directory.
   - Add the following variables:
     ```
     DJANGO_SECRET_KEY=your-secret-key-here
     REGISTRATION_SECRET=your-registration-secret-here
     ```
     - `DJANGO_SECRET_KEY`: A unique secret key for Django (generate a random string).
     - `REGISTRATION_SECRET`: A secret key required for user registration.

5. Run database migrations:
   ```
   python manage.py migrate
   ```

6. Start the Django development server:
   ```
   python manage.py runserver
   ```
   The backend will be running at `http://127.0.0.1:8000/`.

### Frontend Setup

1. Install dependencies:

2. Start the Vite development server:
   ```
   npm run dev
   ```
   The frontend will be running at `http://localhost:5173/` (default Vite port).

## Usage

1. Open your browser and go to the frontend URL (e.g., `http://localhost:5173/`).
2. Register a new account using the registration form (requires the `REGISTRATION_SECRET`).
3. Login with your credentials.
4. Start chatting by selecting a user from the contact list.
5. Send messages and view them in real-time (via polling).
6. Use the block feature to manage unwanted interactions.

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run tests and linting.
5. Submit a pull request.

---

## Contributor

*A V Varma*


