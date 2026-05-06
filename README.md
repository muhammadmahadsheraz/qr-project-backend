# QR App Backend

A professional Node.js/Express backend for QR code management with complete authentication and multi-type QR support.

## 🚀 Features

### Authentication
- User signup with email OTP verification
- Email/password login
- Forgot password with OTP reset
- Profile update (username, email, phone)
- JWT-based session management

### QR Management
- Create QR codes with 3 types:
  - **Website** — redirect to URL
  - **WhatsApp** — deep link with pre-filled message
  - **Image** — redirect to image URL (S3, CDN, etc.)
- Full CRUD operations (Create, Read, Update, Delete)
- Automatic scan counting
- Public scan redirect endpoint

### Security
- Password hashing with bcrypt
- OTP expiration (10 minutes)
- JWT token expiration (7 days)
- Email uniqueness validation
- Input validation on all endpoints
- Scoped data access (users can only access their own QRs)

## 📁 Project Structure

```
src/
├── config/              # Configuration (database, email)
├── controllers/         # Request handlers
│   ├── auth/
│   └── qr/
├── interfaces/          # TypeScript interfaces
├── middlewares/         # Auth, error handling
├── models/              # MongoDB schemas
│   ├── auth/
│   └── qr/
├── routes/              # API routes
├── services/            # Business logic
│   ├── auth/
│   └── qr/
├── utils/               # JWT, OTP utilities
├── validations/         # Input validation
└── app.ts              # Express app setup
```

## 🔧 Installation

### Prerequisites
- Node.js 16+
- MongoDB Atlas account
- Gmail account (for OTP emails)

### Setup

1. **Clone and install:**
```bash
npm install
```

2. **Create `.env` file:**
```bash
cp .env.example .env
```

3. **Configure environment variables:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/qr-app
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

OTP_EXPIRES_IN=10
NODE_ENV=development
```

4. **Start development server:**
```bash
npm run dev
```

Server runs on `http://localhost:5000`

## 📡 API Endpoints

### Base URLs
- Auth: `http://localhost:5000/api/auth`
- QR CRUD: `http://localhost:5000/api/qr`
- QR Scan: `http://localhost:5000/q/:id`

### Authentication (Public)
- `POST /api/auth/signup` — Register user
- `POST /api/auth/verify-otp` — Verify email
- `POST /api/auth/login` — Login
- `POST /api/auth/forgot-password` — Request password reset
- `POST /api/auth/reset-password` — Reset password
- `POST /api/auth/resend-otp` — Resend OTP

### Authentication (Private)
- `PUT /api/auth/update-profile` — Update profile

### QR Management (Private)
- `POST /api/qr` — Create QR
- `GET /api/qr` — Get all your QRs
- `GET /api/qr/:id` — Get single QR
- `PUT /api/qr/:id` — Update QR
- `DELETE /api/qr/:id` — Delete QR

### QR Scan (Public)
- `GET /q/:id` — Scan redirect (increments count, redirects to destination)

## 🔐 Authentication

All private endpoints require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

Get token from:
- `POST /api/auth/verify-otp` (after signup)
- `POST /api/auth/login` (existing user)

## 📊 QR Types

| Type | Fields | Redirect To |
|------|--------|-------------|
| `website` | `url` | Website URL directly |
| `whatsapp` | `phone`, `message` | WhatsApp deep link |
| `image` | `imageName`, `imageUrl`, `imageDescription` | Image URL (S3, CDN, etc.) |

### Example: Create Website QR
```bash
curl -X POST http://localhost:5000/api/qr \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Website",
    "type": "website",
    "websiteData": {
      "url": "https://example.com"
    }
  }'
```

### Example: Create WhatsApp QR
```bash
curl -X POST http://localhost:5000/api/qr \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Contact Support",
    "type": "whatsapp",
    "whatsappData": {
      "phone": "923001234567",
      "message": "Hello! I scanned your QR code."
    }
  }'
```

### Example: Create Image QR
```bash
curl -X POST http://localhost:5000/api/qr \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Product Photo",
    "type": "image",
    "imageData": {
      "imageName": "Summer Collection",
      "imageUrl": "https://s3.amazonaws.com/bucket/image.jpg",
      "imageDescription": "Our latest collection"
    }
  }'
```

## 🧪 Testing

### Using Postman/Thunder Client
1. Import endpoints from `API_DOCUMENTATION.md`
2. Set environment variable: `baseUrl=http://localhost:5000`
3. Test signup → verify OTP → login flow

### Using cURL
See examples above or check `test-api.http` for more

### Database Management
```bash
# Clear all data
npm run db:clear

# Drop entire database
npm run db:drop
```

## 📧 Email Setup (Gmail)

1. Enable 2-Factor Authentication on Gmail
2. Generate App Password:
   - Go to Google Account → Security → App passwords
   - Select "Mail" and "Windows Computer"
   - Copy the generated password
3. Set `SMTP_PASS` in `.env` to this password

**Note:** In development, if email fails, OTP is logged to console.

## 🚀 Deployment

### Environment Variables for Production
```env
MONGODB_URI=<production-mongodb-uri>
JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<your-email>
SMTP_PASS=<app-password>
OTP_EXPIRES_IN=10
NODE_ENV=production
```

**Don't set PORT** — deployment platform sets it automatically.

### Platforms
- Render
- Railway
- Vercel
- Heroku

### MongoDB Atlas Setup
1. Whitelist deployment IP in Network Access
2. Or allow all IPs: `0.0.0.0/0` (for development)

## 📚 Documentation

- **API_DOCUMENTATION.md** — Complete API reference with examples
- **MONGODB_SETUP.md** — MongoDB troubleshooting guide
- **TESTING_GUIDE.md** — Step-by-step testing instructions

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Atlas)
- **Authentication:** JWT + bcrypt
- **Email:** Nodemailer
- **Validation:** express-validator
- **Language:** TypeScript

## 📝 User Model

```typescript
{
  username: string;
  email: string;
  phoneNumber: string;
  password: string;        // hashed
  isVerified: boolean;
  otp?: string;            // temporary
  otpExpires?: Date;       // temporary
  createdAt: Date;
  updatedAt: Date;
}
```

## 📱 QR Model

```typescript
{
  name: string;
  scans: number;
  type: 'whatsapp' | 'website' | 'image';
  whatsappData?: { phone: string; message: string };
  websiteData?: { url: string };
  imageData?: { imageName: string; imageUrl: string; imageDescription: string };
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔄 Authentication Flow

### Signup
```
User → POST /signup → OTP sent to email → User enters OTP → POST /verify-otp → Logged in
```

### Login
```
User → POST /login → Credentials validated → JWT token returned → Logged in
```

### Forgot Password
```
User → POST /forgot-password → OTP sent → POST /reset-password → Password updated
```

## 🔄 QR Scan Flow

```
User scans QR code
    ↓
GET /q/<qr_id>
    ↓
Backend increments scan count
    ↓
Backend redirects (302) to destination
    ↓
├── Website QR → Opens website
├── WhatsApp QR → Opens WhatsApp chat
└── Image QR → Opens image
```

## 🚨 Error Handling

All errors return consistent format:
```json
{
  "success": false,
  "message": "Error description"
}
```

HTTP status codes:
- `200` — OK
- `201` — Created
- `302` — Redirect (scan endpoint)
- `400` — Bad Request / Validation error
- `401` — Unauthorized
- `403` — Forbidden
- `404` — Not Found
- `500` — Server Error

## 📋 Scripts

```bash
npm run dev              # Start development server
npm run build            # Build TypeScript
npm start                # Run production build
npm run db:clear         # Clear database
npm run db:drop          # Drop database
```

## 🔒 Security Notes

- Passwords hashed with bcrypt (10 salt rounds)
- OTPs expire after 10 minutes
- JWT tokens expire after 7 days
- All sensitive fields excluded from API responses
- Input validation on all endpoints
- Users can only access their own data
- Scan endpoint is intentionally public

## 📞 Support

For issues or questions:
1. Check `API_DOCUMENTATION.md` for endpoint details
2. Check `MONGODB_SETUP.md` for database issues
3. Check `TESTING_GUIDE.md` for testing help

## 📄 License

ISC

## 🎯 Next Steps

After authentication and QR management are working:
- Add QR code image generation
- Add analytics dashboard
- Add user profile page
- Add QR code templates
- Add bulk QR creation
- Add QR code expiration
- Add custom QR branding
