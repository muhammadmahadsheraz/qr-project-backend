# 🧪 Testing Guide - QR App Backend

## ✅ Server Status

Your server is running successfully! 

```
✅ MongoDB connected successfully
🚀 Server is running on port 5000
📍 Health check: http://localhost:5000/health
🔐 Auth routes: http://localhost:5000/api/auth
```

---

## 📧 Email Configuration (Development Mode)

Since email is not fully configured, **OTPs will be printed in the console** instead of being sent via email.

When you test signup or forgot password, look for this in your terminal:

```
📧 EMAIL NOT CONFIGURED - OTP for test@example.com : 123456
⏰ OTP expires in 10 minutes
```

**Copy the OTP from the console and use it in the verify-otp or reset-password endpoints.**

---

## 🧪 Testing Methods

### Method 1: Using Postman

1. **Download Postman**: https://www.postman.com/downloads/
2. **Create a new collection** called "QR App"
3. **Add requests** for each endpoint (see API_DOCUMENTATION.md)
4. **Test the flow**:
   - Signup → Check console for OTP → Verify OTP → Login

### Method 2: Using Thunder Client (VS Code Extension)

1. **Install Thunder Client** extension in VS Code
2. **Open the `test-api.http` file** I created
3. **Click "Send Request"** on each endpoint
4. **Check console** for OTPs

### Method 3: Using cURL (Command Line)

Open a **new terminal** (keep the server running in the first one):

```bash
# Test Health Check
curl http://localhost:5000/health

# Test Signup
curl -X POST http://localhost:5000/api/auth/signup ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"phoneNumber\":\"+1234567890\",\"password\":\"password123\"}"
```

---

## 🎯 Complete Testing Flow

### Step 1: Test Health Check

**Request:**
```
GET http://localhost:5000/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "QR App Backend is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### Step 2: Signup

**Request:**
```
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "phoneNumber": "+1234567890",
  "password": "password123"
}
```

**Expected Response:**
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

**Check Console for OTP:**
```
📧 EMAIL NOT CONFIGURED - OTP for john@example.com : 456789
⏰ OTP expires in 10 minutes
```

---

### Step 3: Verify OTP

**Copy the OTP from console** (e.g., 456789)

**Request:**
```
POST http://localhost:5000/api/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "456789"
}
```

**Expected Response:**
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

**Save the token** - you'll need it for protected routes later!

---

### Step 4: Login

**Request:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response:**
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

---

### Step 5: Forgot Password

**Request:**
```
POST http://localhost:5000/api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email. Please verify to reset your password."
}
```

**Check Console for OTP:**
```
📧 EMAIL NOT CONFIGURED - OTP for john@example.com : 789012
⏰ OTP expires in 10 minutes
```

---

### Step 6: Reset Password

**Copy the OTP from console** (e.g., 789012)

**Request:**
```
POST http://localhost:5000/api/auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "789012",
  "newPassword": "newpassword456"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Password reset successful. You can now login with your new password."
}
```

---

### Step 7: Login with New Password

**Request:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "newpassword456"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "..."
  }
}
```

---

## 🐛 Common Issues

### Issue 1: "User with this email already exists"

**Solution:** Use a different email or delete the user from MongoDB Atlas:
1. Go to MongoDB Atlas → Browse Collections
2. Find the user in the `users` collection
3. Delete the document

### Issue 2: "Invalid OTP"

**Solution:** 
- Make sure you copied the OTP correctly from console
- Check if OTP expired (10 minutes)
- Request a new OTP using `/resend-otp`

### Issue 3: "Please verify your email first"

**Solution:** Complete the OTP verification step first before logging in

---

## 📊 Testing Checklist

- [ ] Health check works
- [ ] Signup creates user and shows OTP in console
- [ ] Verify OTP logs user in and returns token
- [ ] Login works with email/password
- [ ] Forgot password sends OTP to console
- [ ] Reset password updates password successfully
- [ ] Login works with new password
- [ ] Resend OTP generates new OTP

---

## 🔧 Next Steps

Once all tests pass:

1. **Configure real email** (optional):
   - Update `.env` with Gmail App Password
   - OTPs will be sent to real emails

2. **Add QR code features**:
   - QR generation endpoint
   - QR scanning endpoint
   - Data storage/retrieval

3. **Deploy to production**:
   - Deploy to Heroku, Railway, or Render
   - Update MongoDB IP whitelist for production

---

## 💡 Pro Tips

1. **Keep server running** in one terminal while testing in another
2. **Watch console output** for OTPs and errors
3. **Use Postman collections** to save all requests
4. **Test error cases** too (wrong password, invalid email, etc.)
5. **Save JWT tokens** for future protected route testing

---

## 🎉 Success Indicators

If you see these, everything is working:

✅ Server starts without errors  
✅ MongoDB connects successfully  
✅ Signup returns user data  
✅ OTP appears in console  
✅ Verify OTP returns JWT token  
✅ Login returns JWT token  
✅ Password reset works  

---

## 📞 Need Help?

Check these files:
- `API_DOCUMENTATION.md` - Complete API reference
- `MONGODB_SETUP.md` - MongoDB troubleshooting
- `README.md` - Project overview

Happy Testing! 🚀
