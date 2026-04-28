# QR App - API Documentation

## Base URL
```
http://localhost:5000/api/auth
```

---

## 📋 Table of Contents
1. [Signup](#1-signup)
2. [Verify OTP](#2-verify-otp)
3. [Login](#3-login)
4. [Forgot Password](#4-forgot-password)
5. [Reset Password](#5-reset-password)
6. [Resend OTP](#6-resend-otp)

---

## 1. Signup

Register a new user and receive OTP via email.

### Endpoint
```
POST /api/auth/signup
```

### Request Headers
```
Content-Type: application/json
```

### Request Body
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "phoneNumber": "+1234567890",
  "password": "password123"
}
```

### Request Body Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| username | string | Yes | Username (min 3 characters) |
| email | string | Yes | Valid email address |
| phoneNumber | string | Yes | User's phone number |
| password | string | Yes | Password (min 6 characters) |

### Success Response (201 Created)
```json
{
  "success": true,
  "message": "Signup successful. Please check your email for OTP verification.",
  "data": {
    "user": {
      "id": "65f8a1b2c3d4e5f6a7b8c9d0",
      "username": "johndoe",
      "email": "john@example.com",
      "phoneNumber": "+1234567890",
      "isVerified": false
    }
  }
}
```

### Error Response (400 Bad Request)
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### Validation Error Response (400 Bad Request)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Username must be at least 3 characters long",
      "param": "username",
      "location": "body"
    }
  ]
}
```

### Notes
- OTP is sent to the provided email
- OTP expires in 10 minutes (configurable)
- User account is created but not verified until OTP is confirmed

---

## 2. Verify OTP

Verify the OTP sent to email and complete registration. User is automatically logged in upon successful verification.

### Endpoint
```
POST /api/auth/verify-otp
```

### Request Headers
```
Content-Type: application/json
```

### Request Body
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

### Request Body Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Email address used during signup |
| otp | string | Yes | 6-digit OTP received via email |

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Email verified successfully. You are now logged in.",
  "data": {
    "user": {
      "id": "65f8a1b2c3d4e5f6a7b8c9d0",
      "username": "johndoe",
      "email": "john@example.com",
      "phoneNumber": "+1234567890",
      "isVerified": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWY4YTFiMmMzZDRlNWY2YTdiOGM5ZDAiLCJpYXQiOjE2OTg3NjU0MzIsImV4cCI6MTY5OTM3MDIzMn0.abc123xyz"
  }
}
```

### Error Responses

**User Not Found (400 Bad Request)**
```json
{
  "success": false,
  "message": "User not found"
}
```

**Already Verified (400 Bad Request)**
```json
{
  "success": false,
  "message": "User is already verified"
}
```

**Invalid OTP (400 Bad Request)**
```json
{
  "success": false,
  "message": "Invalid OTP"
}
```

**Expired OTP (400 Bad Request)**
```json
{
  "success": false,
  "message": "OTP has expired. Please request a new one."
}
```

### Notes
- JWT token is returned upon successful verification
- Token should be stored and used for authenticated requests
- Token expires in 7 days (configurable)

---

## 3. Login

Login with email and password for verified users.

### Endpoint
```
POST /api/auth/login
```

### Request Headers
```
Content-Type: application/json
```

### Request Body
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Request Body Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Registered email address |
| password | string | Yes | User's password |

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "65f8a1b2c3d4e5f6a7b8c9d0",
      "username": "johndoe",
      "email": "john@example.com",
      "phoneNumber": "+1234567890",
      "isVerified": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWY4YTFiMmMzZDRlNWY2YTdiOGM5ZDAiLCJpYXQiOjE2OTg3NjU0MzIsImV4cCI6MTY5OTM3MDIzMn0.abc123xyz"
  }
}
```

### Error Responses

**Invalid Credentials (401 Unauthorized)**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Email Not Verified (401 Unauthorized)**
```json
{
  "success": false,
  "message": "Please verify your email first"
}
```

### Notes
- User must have verified their email before logging in
- JWT token is returned for authenticated requests
- Store the token securely on the client side

---

## 4. Forgot Password

Request a password reset OTP when user forgets their password.

### Endpoint
```
POST /api/auth/forgot-password
```

### Request Headers
```
Content-Type: application/json
```

### Request Body
```json
{
  "email": "john@example.com"
}
```

### Request Body Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Registered email address |

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "OTP sent to your email. Please verify to reset your password."
}
```

### Error Response (400 Bad Request)
```json
{
  "success": false,
  "message": "User not found"
}
```

### Notes
- OTP is sent to the registered email
- OTP expires in 10 minutes
- Use this OTP with the Reset Password endpoint

---

## 5. Reset Password

Reset password using the OTP received via email.

### Endpoint
```
POST /api/auth/reset-password
```

### Request Headers
```
Content-Type: application/json
```

### Request Body
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

### Request Body Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Registered email address |
| otp | string | Yes | 6-digit OTP received via email |
| newPassword | string | Yes | New password (min 6 characters) |

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Password reset successful. You can now login with your new password."
}
```

### Error Responses

**User Not Found (400 Bad Request)**
```json
{
  "success": false,
  "message": "User not found"
}
```

**Invalid OTP (400 Bad Request)**
```json
{
  "success": false,
  "message": "Invalid OTP"
}
```

**Expired OTP (400 Bad Request)**
```json
{
  "success": false,
  "message": "OTP has expired. Please request a new one."
}
```

**OTP Not Found (400 Bad Request)**
```json
{
  "success": false,
  "message": "OTP not found. Please request a new one."
}
```

### Notes
- Password is automatically hashed before storing
- User can login with new password immediately after reset
- OTP is invalidated after successful password reset

---

## 6. Resend OTP

Request a new OTP if the previous one expired or was not received.

### Endpoint
```
POST /api/auth/resend-otp
```

### Request Headers
```
Content-Type: application/json
```

### Request Body
```json
{
  "email": "john@example.com"
}
```

### Request Body Parameters
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Email address |

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "OTP resent successfully. Please check your email."
}
```

### Error Responses

**User Not Found (400 Bad Request)**
```json
{
  "success": false,
  "message": "User not found"
}
```

**Already Verified (400 Bad Request)**
```json
{
  "success": false,
  "message": "User is already verified"
}
```

**Email Required (400 Bad Request)**
```json
{
  "success": false,
  "message": "Email is required"
}
```

### Notes
- New OTP is generated and sent to email
- Previous OTP is invalidated
- New OTP expires in 10 minutes

---

## 🔐 Authentication for Protected Routes

For future protected endpoints, include the JWT token in the request header:

### Request Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Example Protected Request
```bash
curl -X GET http://localhost:5000/api/protected-route \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

---

## 📊 HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Invalid credentials or token |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## 🧪 Testing Flow

### Complete User Journey

1. **Signup**
   ```bash
   POST /api/auth/signup
   Body: { username, email, phoneNumber, password }
   → Check email for OTP
   ```

2. **Verify OTP**
   ```bash
   POST /api/auth/verify-otp
   Body: { email, otp }
   → Save the JWT token
   ```

3. **Login (Future sessions)**
   ```bash
   POST /api/auth/login
   Body: { email, password }
   → Save the JWT token
   ```

### Forgot Password Flow

1. **Request Reset**
   ```bash
   POST /api/auth/forgot-password
   Body: { email }
   → Check email for OTP
   ```

2. **Reset Password**
   ```bash
   POST /api/auth/reset-password
   Body: { email, otp, newPassword }
   ```

3. **Login with New Password**
   ```bash
   POST /api/auth/login
   Body: { email, newPassword }
   ```

---

## 🛠️ Testing Tools

### Using cURL

**Signup Example:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "phoneNumber": "+1234567890",
    "password": "password123"
  }'
```

**Login Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Using Postman/Thunder Client

1. Create a new collection named "QR App Auth"
2. Add all 6 endpoints
3. Set environment variable for `baseUrl`: `http://localhost:5000/api/auth`
4. Test each endpoint in sequence

---

## 📝 Common Error Messages

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "User with this email already exists" | Email already registered | Use different email or login |
| "Invalid email or password" | Wrong credentials | Check email and password |
| "Please verify your email first" | Email not verified | Complete OTP verification |
| "Invalid OTP" | Wrong OTP entered | Check email for correct OTP |
| "OTP has expired" | OTP older than 10 minutes | Request new OTP via resend |
| "Validation failed" | Invalid input format | Check request body format |

---

## 🔒 Security Notes

- Passwords are hashed using bcrypt before storage
- OTPs expire after 10 minutes
- JWT tokens expire after 7 days
- All sensitive fields are excluded from responses
- Input validation on all endpoints
- Email verification required before login

---

## 📧 Email Configuration

Make sure your `.env` file has correct email settings:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

For Gmail, use App Password (not regular password):
1. Enable 2FA on Gmail
2. Generate App Password from Google Account settings
3. Use that password in EMAIL_PASSWORD

---

## 🎯 Next Steps

After authentication is working:
- Add QR code generation endpoints
- Add QR code scanning endpoints
- Add user profile management
- Add QR code data retrieval by ID
