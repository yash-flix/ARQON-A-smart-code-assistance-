
# ARQON - Smart Code Assistant 🤖

An AI-powered code analysis and assistance platform built with the MERN stack and Google Gemini AI.

## Features

✨ **AI Code Analysis** - Detect bugs, security issues, and code quality problems
🔧 **Smart Bug Fixing** - AI-powered automated bug fixes
📝 **Documentation Generator** - Auto-generate comprehensive code documentation
🎯 **Multi-Language Support** - JavaScript, Python, Java, C++, TypeScript, and more
🔐 **Secure Authentication** - JWT-based user authentication
📊 **Usage Tracking** - Monitor API usage with subscription tiers

## Tech Stack

### Frontend
- React 18
- Material-UI (MUI)
- Monaco Editor (VS Code editor)
- Axios
- React Router v6
- Vite

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Google Gemini AI API
- JWT Authentication
- bcryptjs

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Google Gemini API Key

## Installation

### 1. Clone the repository

git clone https://github.com/yash-flix/ARQON-A-smart-code-assistance-.git
cd ARQON-A-smart-code-assistance-

text

### 2. Backend Setup

cd server
npm install

Create .env file from example
copy .env.example .env

Edit .env and add your credentials:
- MongoDB URI
- JWT Secret
- Gemini API Key
text

### 3. Frontend Setup

cd ../client
npm install

Create .env file from example
copy .env.example .env

text

### 4. Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in `server/.env`

## Running the Application

### Start Backend (Terminal 1)

cd server
npm run dev

text

Server will run on `http://localhost:5000`

### Start Frontend (Terminal 2)

cd client
npm run dev

text

Client will run on `http://localhost:5173`

## Usage

1. Open `http://localhost:5173` in your browser
2. Create an account (Sign Up)
3. Login with your credentials
4. Navigate to Code Editor
5. Write or paste your code
6. Click "Analyze Code" to get AI-powered insights

## Project Structure

ARQON/
├── client/ # React frontend
│ ├── src/
│ │ ├── pages/ # React pages (Login, Signup, Dashboard, CodeEditor)
│ │ ├── utils/ # API utilities
│ │ └── App.jsx # Main app component
│ └── package.json
│
├── server/ # Node.js backend
│ ├── controllers/ # Route controllers
│ ├── middleware/ # Auth middleware
│ ├── models/ # MongoDB models
│ ├── routes/ # API routes
│ ├── services/ # AI services (Gemini)
│ └── server.js # Entry point
│
└── README.md

text

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Code Analysis
- `POST /api/code/analyze` - Analyze code for bugs
- `POST /api/code/fix-bug` - Get bug fix suggestions
- `POST /api/code/generate-docs` - Generate documentation
- `GET /api/code/history` - Get analysis history

## Environment Variables

### Server (.env)
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173

text

### Client (.env)
VITE_API_URL=http://localhost:5000/api

text

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Author

**Yash Ranee**
- GitHub: [@yash-flix](https://github.com/yash-flix)
- Email: yash.tushar13@gmail.com

## Acknowledgments

- Google Gemini AI for code analysis capabilities
- MongoDB for database services
- Material-UI for beautiful UI components

---

⭐ Star this repo if you found it helpful!
