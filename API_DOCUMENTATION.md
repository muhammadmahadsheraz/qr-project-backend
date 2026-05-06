# QR App - API Documentation

## Base URLs
```
Auth:     http://localhost:5000/api/auth
QR CRUD:  http://localhost:5000/api/qr
QR Scan:  http://localhost:5000/q
```

---

## 📋 Table of Contents

### 🔐 Auth
1. [Signup](#1-signup)
2. [Verify OTP](#2-verify-otp)
3. [Login](#3-login)
4. [Forgot Password](#4-forgot-password)
5. [Reset Password](#5-reset-password)
6. [Resend OTP](#6-resend-otp)
7. [Update Profile](#7-update-profile)

### 📱 QR
8. [Create QR](#8-create-qr)
9. [Get All QRs](#9-get-all-qrs)
10. [Get QR by ID](#10-get-qr-by-id)
11. [Update QR](#11-update-qr)
12. [Delete QR](#12-delete-qr)
13. [Scan Redirect](#13-scan-redirect)

---

## 🔐 Authentication

All QR endpoints require a JWT token in the header:
```
Authorization: Bearer <your_jwt_token>
```

The token is returned from **Login** or **Verify OTP**.

---

# AUTH ENDPOINTS

## 1. Signup

Register a new user. An OTP is sent to the provided email.

### Endpoint
```
POST /api/auth/signup/:id
```

### Request Body
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| username | string | Yes | Min 3 characters |
| email | string | Yes | Valid email format |
| phoneNumber | string | Yes | Any format |
| password | string | Yes | Min 6 characters |

### Success Response (201)
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

### Error Responses (400)
```json
{ "success": false, "message": "User with this email already exists" }
```
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "msg": "Username must be at least 3 characters long" }]
}
```

---

## 2. Verify OTP

Verify the OTP sent to email. Logs the user in automatically on success.

### Endpoint
```
POST /api/auth/verify-otp
```

### Request Body
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| email | string | Yes | Must match signup email |
| otp | string | Yes | Exactly 6 digits |

### Success Response (200)
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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Error Responses (400)
```json
{ "success": false, "message": "User not found" }
{ "success": false, "message": "User is already verified" }
{ "success": false, "message": "Invalid OTP" }
{ "success": false, "message": "OTP has expired. Please request a new one." }
```

---

## 3. Login

Login with email and password.

### Endpoint
```
POST /api/auth/login
```

### Request Body
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

| Field | Type | Required |
|-------|------|----------|
| email | string | Yes |
| password | string | Yes |

### Success Response (200)
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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Error Responses
```json
{ "success": false, "message": "Invalid email or password" }           // 401
{ "success": false, "message": "Please verify your email first" }      // 401
```

---

## 4. Forgot Password

Send a password reset OTP to the user's email.

### Endpoint
```
POST /api/auth/forgot-password
```

### Request Body
```json
{
  "email": "john@example.com"
}
```

### Success Response (200)
```json
{
  "success": true,
  "message": "OTP sent to your email. Please verify to reset your password."
}
```

### Error Response (400)
```json
{ "success": false, "message": "User not found" }
```

---

## 5. Reset Password

Reset the password using the OTP received via email.

### Endpoint
```
POST /api/auth/reset-password
```

### Request Body
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| email | string | Yes | Registered email |
| otp | string | Yes | 6-digit OTP from email |
| newPassword | string | Yes | Min 6 characters |

### Success Response (200)
```json
{
  "success": true,
  "message": "Password reset successful. You can now login with your new password."
}
```

### Error Responses (400)
```json
{ "success": false, "message": "User not found" }
{ "success": false, "message": "Invalid OTP" }
{ "success": false, "message": "OTP has expired. Please request a new one." }
{ "success": false, "message": "OTP not found. Please request a new one." }
```

---

## 6. Resend OTP

Resend a new OTP to the user's email (invalidates the previous one).

### Endpoint
```
POST /api/auth/resend-otp
```

### Request Body
```json
{
  "email": "john@example.com"
}
```

### Success Response (200)
```json
{
  "success": true,
  "message": "OTP resent successfully. Please check your email."
}
```

### Error Responses (400)
```json
{ "success": false, "message": "User not found" }
{ "success": false, "message": "User is already verified" }
{ "success": false, "message": "Email is required" }
```

---

## 7. Update Profile

Update the logged-in user's profile. All fields are optional — only send what needs to change.

### Endpoint
```
PUT /api/auth/update-profile
```

### Request Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Request Body
```json
{
  "username": "newusername",
  "email": "newemail@example.com",
  "phoneNumber": "+9230012345"
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| username | string | No | Min 3 characters if provided |
| email | string | No | Valid email format if provided |
| phoneNumber | string | No | Cannot be empty if provided |

### Success Response (200)
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "65f8a1b2c3d4e5f6a7b8c9d0",
      "username": "newusername",
      "email": "newemail@example.com",
      "phoneNumber": "+9230012345",
      "isVerified": true
    }
  }
}
```

### Error Responses
```json
{ "success": false, "message": "Email is already in use by another account" }  // 400
{ "success": false, "message": "Authentication token is required" }            // 401
{ "success": false, "message": "Validation failed", "errors": [...] }          // 400
```

### Notes
- Password cannot be changed here — use the forgot password / reset password flow
- If changing email, the new email must not be taken by another account

---

---

# QR ENDPOINTS

## QR Model

A QR has a `type` of either `whatsapp`, `website`, or `image`. The type determines which data fields are present:

| type | fields | redirect to |
|------|--------|-------------|
| `whatsapp` | `whatsappData.phone`, `whatsappData.message` | WhatsApp deep link |
| `website` | `websiteData.url` | Website URL directly |
| `image` | `imageData.imageName`, `imageData.imageUrl`, `imageData.imageDescription` | Image URL (S3, CDN, etc.) |

---

## 8. Create QR

Create a new QR code linked to the logged-in user.

### Endpoint
```
POST /api/qr
```

### Request Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Request Body — WhatsApp type
```json
{
  "name": "My WhatsApp QR",
  "type": "whatsapp",
  "whatsappData": {
    "phone": "923001234567",
    "message": "Hello! I scanned your QR code."
  }
}
```

### Request Body — Website type
```json
{
  "name": "My Website QR",
  "type": "website",
  "websiteData": {
    "url": "https://example.com"
  }
}
```

### Request Body — Image type
```json
{
  "name": "Product Photo",
  "type": "image",
  "imageData": {
    "imageName": "Summer Collection 2024",
    "imageUrl": "https://s3.amazonaws.com/my-bucket/summer-collection.jpg",
    "imageDescription": "Our latest summer clothing collection"
  }
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| name | string | Yes | QR label |
| type | string | Yes | `"whatsapp"`, `"website"`, or `"image"` |
| whatsappData.phone | string | If type=whatsapp | Phone number with country code, no `+` |
| whatsappData.message | string | If type=whatsapp | Pre-filled WhatsApp message |
| websiteData.url | string | If type=website | Valid URL |
| imageData.imageName | string | If type=image | Display name for the image |
| imageData.imageUrl | string | If type=image | Valid image URL (S3, CDN, etc.) |
| imageData.imageDescription | string | If type=image | Alt text / description |

### Success Response (201) — WhatsApp
```json
{
  "success": true,
  "message": "QR created successfully",
  "data": {
    "qr": {
      "id": "65f8a1b2c3d4e5f6a7b8c9d0",
      "name": "My WhatsApp QR",
      "scans": 0,
      "type": "whatsapp",
      "whatsappData": {
        "phone": "923001234567",
        "message": "Hello! I scanned your QR code."
      },
      "userId": "65f8a1b2c3d4e5f6a7b8c9d1",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### Success Response (201) — Website
```json
{
  "success": true,
  "message": "QR created successfully",
  "data": {
    "qr": {
      "id": "65f8a1b2c3d4e5f6a7b8c9d0",
      "name": "My Website QR",
      "scans": 0,
      "type": "website",
      "websiteData": {
        "url": "https://example.com"
      },
      "userId": "65f8a1b2c3d4e5f6a7b8c9d1",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### Success Response (201) — Image
```json
{
  "success": true,
  "message": "QR created successfully",
  "data": {
    "qr": {
      "id": "65f8a1b2c3d4e5f6a7b8c9d2",
      "name": "Product Photo",
      "scans": 0,
      "type": "image",
      "imageData": {
        "imageName": "Summer Collection 2024",
        "imageUrl": "https://s3.amazonaws.com/my-bucket/summer-collection.jpg",
        "imageDescription": "Our latest summer clothing collection"
      },
      "userId": "65f8a1b2c3d4e5f6a7b8c9d1",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### Error Responses
```json
{ "success": false, "message": "Validation failed", "errors": [...] }  // 400
{ "success": false, "message": "Authentication token is required" }    // 401
```

---

## 9. Get All QRs

Get all QR codes belonging to the logged-in user, sorted newest first.

### Endpoint
```
GET /api/qr
```

### Request Headers
```
Authorization: Bearer <token>
```

### Success Response (200)
```json
{
  "success": true,
  "message": "QRs fetched successfully",
  "data": {
    "qrs": [
      {
        "id": "65f8a1b2c3d4e5f6a7b8c9d0",
        "name": "My WhatsApp QR",
        "scans": 14,
        "type": "whatsapp",
        "whatsappData": {
          "phone": "923001234567",
          "message": "Hello! I scanned your QR code."
        },
        "userId": "65f8a1b2c3d4e5f6a7b8c9d1",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      },
      {
        "id": "65f8a1b2c3d4e5f6a7b8c9d2",
        "name": "My Website QR",
        "scans": 3,
        "type": "website",
        "websiteData": {
          "url": "https://example.com"
        },
        "userId": "65f8a1b2c3d4e5f6a7b8c9d1",
        "createdAt": "2024-01-14T08:00:00.000Z",
        "updatedAt": "2024-01-14T08:00:00.000Z"
      }
    ],
    "total": 2
  }
}
```

---

## 10. Get QR by ID

Get a single QR code by its ID. Only returns QRs owned by the logged-in user.

### Endpoint
```
GET /api/qr/:id
```

### Request Headers
```
Authorization: Bearer <token>
```

### Success Response (200)
```json
{
  "success": true,
  "message": "QR fetched successfully",
  "data": {
    "qr": {
      "id": "65f8a1b2c3d4e5f6a7b8c9d0",
      "name": "My WhatsApp QR",
      "scans": 14,
      "type": "whatsapp",
      "whatsappData": {
        "phone": "923001234567",
        "message": "Hello! I scanned your QR code."
      },
      "userId": "65f8a1b2c3d4e5f6a7b8c9d1",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### Error Responses
```json
{ "success": false, "message": "QR not found" }           // 404
{ "success": false, "message": "Invalid QR ID" }          // 400
```

---

## 11. Update QR

Update a QR code. Only the owner can update it. All fields are optional.

### Endpoint
```
PUT /api/qr/:id
```

### Request Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Request Body — Update WhatsApp QR
```json
{
  "name": "Updated QR Name",
  "whatsappData": {
    "phone": "923009876543",
    "message": "New pre-filled message"
  }
}
```

### Request Body — Update Website QR
```json
{
  "name": "Updated QR Name",
  "websiteData": {
    "url": "https://newurl.com"
  }
}
```

### Request Body — Update Image QR
```json
{
  "name": "Updated Product Photo",
  "imageData": {
    "imageName": "Winter Collection 2024",
    "imageUrl": "https://s3.amazonaws.com/my-bucket/winter-collection.jpg",
    "imageDescription": "Our latest winter clothing collection"
  }
}
```

### Request Body — Switch type from website to whatsapp
```json
{
  "type": "whatsapp",
  "whatsappData": {
    "phone": "923001234567",
    "message": "Hello!"
  }
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| name | string | No | Cannot be empty if provided |
| type | string | No | `"whatsapp"`, `"website"`, or `"image"` |
| whatsappData.phone | string | No | Required if switching to whatsapp |
| whatsappData.message | string | No | Required if switching to whatsapp |
| websiteData.url | string | No | Valid URL |
| imageData.imageName | string | No | Cannot be empty if provided |
| imageData.imageUrl | string | No | Valid image URL |
| imageData.imageDescription | string | No | Cannot be empty if provided |

### Success Response (200)
```json
{
  "success": true,
  "message": "QR updated successfully",
  "data": {
    "qr": {
      "id": "65f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Updated QR Name",
      "scans": 14,
      "type": "whatsapp",
      "whatsappData": {
        "phone": "923009876543",
        "message": "New pre-filled message"
      },
      "userId": "65f8a1b2c3d4e5f6a7b8c9d1",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  }
}
```

### Error Responses
```json
{ "success": false, "message": "QR not found" }   // 404
{ "success": false, "message": "Invalid QR ID" }  // 400
```

---

## 12. Delete QR

Delete a QR code. Only the owner can delete it.

### Endpoint
```
DELETE /api/qr/:id
```

### Request Headers
```
Authorization: Bearer <token>
```

### Success Response (200)
```json
{
  "success": true,
  "message": "QR deleted successfully"
}
```

### Error Responses
```json
{ "success": false, "message": "QR not found" }   // 404
{ "success": false, "message": "Invalid QR ID" }  // 400
```

---

## 13. Scan Redirect

**This is the URL embedded inside the physical QR image.** When a user scans the QR code with their phone camera, this endpoint is hit. It increments the scan count and redirects to the appropriate destination.

### Endpoint
```
GET /q/:id
```

### Access
Public — no token required.

### Behavior

| QR type | Redirect destination |
|---------|----------------------|
| `website` | The stored URL directly, e.g. `https://example.com` |
| `whatsapp` | A WhatsApp deep link: `https://wa.me/<phone>?text=<encodedMessage>` |
| `image` | The image URL directly, e.g. `https://s3.amazonaws.com/my-bucket/image.jpg` |

### Success Response
```
HTTP 302 Found
Location: https://wa.me/923001234567?text=Hello%21%20I%20scanned%20your%20QR%20code.
```
or
```
HTTP 302 Found
Location: https://example.com
```
or
```
HTTP 302 Found
Location: https://s3.amazonaws.com/my-bucket/summer-collection.jpg
```

The browser/phone follows the redirect automatically. No JSON is returned.

### Error Response (404)
```json
{
  "success": false,
  "message": "QR not found"
}
```

### Notes
- Scan count is incremented atomically on every hit
- The QR image generated by the frontend should encode the URL as `https://yourapp.com/q/<qr_id>`
- No authentication needed — anyone who scans the QR can trigger this

---

## 📊 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 302 | Redirect (scan endpoint) |
| 400 | Bad Request / Validation error |
| 401 | Unauthorized — missing or invalid token |
| 403 | Forbidden — email not verified |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## 🔒 Security Notes

- Passwords hashed with bcrypt
- OTPs expire after 10 minutes
- JWT tokens expire after 7 days
- QR CRUD operations are scoped to the owner — you cannot read, update, or delete another user's QRs
- The scan redirect endpoint is intentionally public

---

## 📝 Common Errors

| Message | Cause |
|---------|-------|
| `"Authentication token is required"` | No `Authorization` header sent |
| `"Invalid or expired token"` | Token is wrong or has expired |
| `"QR not found"` | ID doesn't exist or belongs to another user |
| `"Invalid QR ID"` | ID is not a valid MongoDB ObjectId |
| `"Validation failed"` | Missing or invalid fields in request body |
