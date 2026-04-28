# QR App Backend - Authentication System

A professional Node.js/Express backend with MongoDB for QR code management with complete authentication system.

## 🚀 Features

- **User Signup** with email OTP verification
- **User Login** with email and password
- **Forgot Password** flow with OTP verification
- **Password Reset** functionality
- **Resend OTP** capability
- JWT-based authentication
- Professional folder structure
- Input validation
- Error handling

## 📁 Project Structure

```
src/
├── config/
│   ├── database.ts          # MongoDB connection
│   └── email.ts              # Email/OTP configuration
├── controllers/
│   └── auth/
│       └── auth.controller.ts
├── interfaces/
│   └── user.interface.ts
├── middlewares/
│   ├── auth.middleware.ts
│   └── errorHandler.middleware.ts
├── models/
│   └── auth/
│       └── user.model.ts
├── routes/
│   └── auth.routes.ts
├── services/
│   └── auth/
│       └── auth.service.ts
├── utils/
│   ├── jwt.util.ts
│   └── otp.util.ts
├── validations/
│   └── auth.validation.ts
└── app.ts
```

## 🔧 Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Setup environment variables:**
```bash
cp .env.example .env
```

3. **Configure `.env` file:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/qr-app
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

OTP_EXPIRES_IN=10
```

## 📧 Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate a new app password
   - Use this password in `EMAIL_PASSWORD`

## 🏃 Running the Application

**Development mode:**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
npm start
```

## 📡 API Endpoints

### Base URL: `http://localhost:5000/api/auth`

### 1. **Signup** - Register new user
```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "phoneNumber": "+1234567890",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Signup successful. Please check your email for OTP verification.",
  "data": {
    "user": {
      "id": "...",
      "username": "johndoe",
      "email": "john@example.com",
      "phoneNumber": "+1234567890",
      "isVerified": false
    }
  }
}
```

### 2. **Verify OTP** - Complete signup
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully. You are now logged in.",
  "data": {
    "user": {
      "id": "...",
      "username": "johndoe",
      "email": "john@example.com",
      "phoneNumber": "+1234567890",
      "isVerified": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. **Login** - User login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "username": "johndoe",
      "email": "john@example.com",
      "phoneNumber": "+1234567890",
      "isVerified": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 4. **Forgot Password** - Request password reset
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email. Please verify to reset your password."
}
```

### 5. **Reset Password** - Complete password reset
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful. You can now login with your new password."
}
```

### 6. **Resend OTP** - Request new OTP
```http
POST /api/auth/resend-otp
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP resent successfully. Please check your email."
}
```

## 🔐 Authentication Flow

### Signup Flow:
1. User submits signup form → `POST /api/auth/signup`
2. System creates user and sends OTP to email
3. User enters OTP → `POST /api/auth/verify-otp`
4. System verifies OTP and logs user in (returns JWT token)

### Login Flow:
1. User enters email and password → `POST /api/auth/login`
2. System validates credentials
3. Returns JWT token if successful

### Forgot Password Flow:
1. User enters email → `POST /api/auth/forgot-password`
2. System sends OTP to email
3. User enters OTP and new password → `POST /api/auth/reset-password`
4. System verifies OTP and updates password

## 🛡️ Protected Routes (Future Use)

To protect routes, use the authentication middleware:

```typescript
import { authenticate } from './middlewares/auth.middleware';

router.get('/protected', authenticate, controller.method);
```

Send JWT token in headers:
```http
Authorization: Bearer <your-jwt-token>
```

## 🧪 Testing with Postman/Thunder Client

1. Import the endpoints above
2. Start with signup
3. Check your email for OTP
4. Verify OTP to get token
5. Use token for protected routes

## 🔧 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Atlas)
- **Authentication:** JWT
- **Password Hashing:** bcrypt
- **Email:** Nodemailer
- **Validation:** express-validator
- **Language:** TypeScript

## 📝 User Model

```typescript
{
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  isVerified: boolean;
  otp?: string;
  otpExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🚨 Error Handling

All errors return consistent format:
```json
{
  "success": false,
  "message": "Error message here"
}
```

## 📌 Next Steps

After authentication is working, you can add:
- QR code generation endpoints
- QR code scanning endpoints
- User profile management
- QR code data storage and retrieval

## 📄 License

ISC
