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

### 🔐 Authentication
- **Firebase Authentication** with Google Sign-In
- **Email/Password Authentication** with proper validation
- **Email Verification** system
- **Secure Session Management**

### 📊 Profile Management
- **Multi-step Profile Form** with progress tracking
- **Real-time Validation** with helpful error messages
- **Professional Information** collection (name, contact, address, LinkedIn)
- **Coding Platform Integration** (GitHub, LeetCode, Codeforces, HackerRank)

### 📈 Dashboard Features
- **Real-time Stats** from multiple coding platforms
- **Beautiful UI** with loading states and error handling
- **Responsive Design** that works on all devices
- **Profile Summary** with user information
- **Platform-specific Cards** with detailed statistics

### 🔧 Backend Integration
- **RESTful API** with Express.js and MongoDB
- **User Data Persistence** with proper database schema
- **Platform Stats Fetching** from external APIs
- **Error Handling** and validation

## 🛠️ Tech Stack

### Frontend
- **React 19** with modern hooks
- **Tailwind CSS** for styling
- **Firebase** for authentication
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Cheerio** for web scraping

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

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8080

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