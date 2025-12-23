# 🚀 DevProfile Hub

A modern web application that allows developers to connect and showcase their coding profiles from various platforms like GitHub, LeetCode, Codeforces, and HackerRank in one unified dashboard.

---

## ⚠️ Security Notice

> **Never commit your real secrets or credentials to this repository.**
>
> - All sensitive information (API keys, database URIs, email credentials, etc.) must be stored in `.env` files, which are already gitignored.
> - Use the provided `.env.example` files in both `client/` and `server/` as templates.
> - If you ever accidentally commit a secret, rotate it immediately and remove it from git history.

---

## ✨ Features

### 🔐 Authentication & Security
- **Firebase Authentication** with Google Sign-In
- **Email/Password Authentication** with proper validation
- **Email & Mobile OTP Verification** system
- **Secure Session Management** with JWT
- **Rate Limiting** and security headers
- **Input Validation** on both frontend and backend

### 📊 Profile Management
- **Multi-step Profile Form** with progress tracking
- **Real-time Validation** with helpful error messages
- **Professional Information** collection (name, contact, address, LinkedIn)
- **Resume Upload** with PDF support
- **Project Management** with detailed descriptions and links
- **Public Profile Sharing** with unique URLs

### 📈 Dashboard Features
- **Real-time Stats** from multiple coding platforms
- **Interactive Heatmaps** for GitHub and LeetCode activity
- **Beautiful UI** with loading states and error handling
- **Dark/Light Mode** with persistent preferences
- **Responsive Design** that works on all devices
- **Performance Optimized** with lazy loading and caching

### 🔧 Backend Integration
- **RESTful API** with Express.js and MongoDB
- **Redis Caching** for improved performance
- **User Data Persistence** with proper database schema
- **Platform Stats Fetching** from external APIs
- **Error Handling** and comprehensive logging
- **Health Checks** and monitoring

### 🧪 Testing & Quality
- **Comprehensive Test Suite** with Jest and React Testing Library
- **End-to-End Testing** with Cypress
- **Code Coverage** reporting
- **Linting** and code quality checks
- **Performance Testing** with Lighthouse CI

### 📊 Monitoring & Analytics
- **Error Tracking** with Sentry
- **Performance Monitoring** with Web Vitals
- **User Analytics** and behavior tracking
- **Real-time Logging** and debugging
- **Health Monitoring** and alerts

### 🚀 DevOps & Deployment
- **Docker Containerization** with multi-stage builds
- **CI/CD Pipeline** with GitHub Actions
- **Automated Testing** on multiple Node.js versions
- **Security Audits** and dependency checks
- **Performance Monitoring** with Lighthouse
- **Production Ready** with Nginx reverse proxy

## 🛠️ Tech Stack

### Frontend
- **React 19** with modern hooks and lazy loading
- **Tailwind CSS** for responsive styling
- **Firebase Authentication** with Google Sign-In
- **React Router** for client-side routing
- **React Calendar Heatmap** for activity visualization
- **Sentry** for error tracking and performance monitoring
- **Cypress** for end-to-end testing
- **Jest & React Testing Library** for unit testing

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Redis** for caching and session management
- **JWT** for secure authentication
- **Cheerio** for web scraping
- **Multer** for file uploads
- **Nodemailer** for email services
- **Sentry** for error tracking and monitoring

### DevOps & Infrastructure
- **Docker** with multi-stage builds
- **Docker Compose** for local development
- **GitHub Actions** for CI/CD
- **Nginx** reverse proxy with rate limiting
- **Lighthouse CI** for performance monitoring
- **Codecov** for coverage reporting

### Testing & Quality
- **Jest** for unit testing
- **React Testing Library** for component testing
- **Cypress** for E2E testing
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Firebase project setup

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd devprofilehub
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**

   - Copy the example environment files and fill in your own values:
     ```bash
     # In the server directory
     cp .env.example .env
     # In the client directory
     cp .env.example .env
     ```
   - Edit the new `.env` files in both `client/` and `server/` with your real credentials (never commit these files!).

   **client/.env.example**
   ```env
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

   **server/.env.example**
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_email_address
   EMAIL_PASS=your_email_password
   ```

4. **Start the development servers**
   ```bash
   # Start backend server (from server directory)
   npm start
   
   # Start frontend server (from client directory)
   npm start
   ```

5. **Start the development servers**
   ```bash
   # Start all services with Docker Compose
   docker-compose up -d
   
   # Or start manually
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8080
   - Redis: localhost:6379
   - MongoDB: localhost:27017

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# All tests
npm run test:all

# Coverage report
npm run test:ci
```

### Test Coverage
- **Unit Tests**: 90%+ coverage
- **Integration Tests**: API endpoints
- **E2E Tests**: Complete user journeys
- **Performance Tests**: Lighthouse CI

## 📱 Usage

### For New Users
1. **Sign Up/Login** using Google or email/password
2. **Complete Profile** by filling out the multi-step form
3. **Add Coding Platform Usernames** (GitHub, LeetCode, etc.)
4. **Verify Email** (optional but recommended)
5. **View Dashboard** with all your stats

### For Existing Users
1. **Login** with your existing account
2. **View Dashboard** with updated stats
3. **Update Profile** if needed

## 🔧 API Endpoints

### User Management
- `GET /api/users/profile/:firebaseUid` - Get user profile
- `POST /api/users/profile` - Create/update profile
- `PUT /api/users/profile/:firebaseUid/links` - Update platform links
- `PUT /api/users/profile/:firebaseUid/verify` - Verify email
- `DELETE /api/users/profile/:firebaseUid` - Delete profile

### Platform Stats
- `GET /api/users/stats/github?username=:username` - GitHub stats
- `GET /api/users/stats/leetcode?username=:username` - LeetCode stats
- `GET /api/users/stats/codeforces?username=:username` - Codeforces stats
- `GET /api/users/stats/hackerrank?username=:username` - HackerRank stats

## 🎨 UI/UX Features

### Modern Design
- **Gradient Backgrounds** with purple/pink theme
- **Card-based Layout** with shadows and rounded corners
- **Smooth Animations** and transitions
- **Loading States** with skeleton screens
- **Error Handling** with user-friendly messages

### Responsive Design
- **Mobile-first** approach
- **Flexible Grid System** that adapts to screen size
- **Touch-friendly** buttons and inputs
- **Optimized Typography** for readability

## 🔒 Security Features

- **Firebase Authentication** for secure user management
- **Input Validation** on both frontend and backend
- **CORS Protection** for API endpoints
- **Error Handling** without exposing sensitive information
- **No secrets or credentials in codebase** (see Security Notice above)

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `build` folder

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy using Git integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Firebase for authentication
- Tailwind CSS for styling
- Various coding platform APIs for stats
- React community for excellent documentation

---

**Made with ❤️ for the developer community** 