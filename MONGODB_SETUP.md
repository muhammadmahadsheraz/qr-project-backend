# MongoDB Atlas Connection Issues - Troubleshooting Guide

## Error: `getaddrinfo ENOTFOUND`

This error means your application cannot reach MongoDB Atlas. Here are the solutions:

---

## ✅ Solution 1: Allow All IP Addresses (Recommended for Development)

1. **Go to MongoDB Atlas Dashboard**
   - Visit: https://cloud.mongodb.com/

2. **Navigate to Network Access**
   - Click on "Network Access" in the left sidebar
   - Or go to: Security → Network Access

3. **Add IP Address**
   - Click "ADD IP ADDRESS" button
   - Click "ALLOW ACCESS FROM ANYWHERE"
   - This will add `0.0.0.0/0` (allows all IPs)
   - Click "Confirm"

4. **Wait 1-2 minutes** for changes to propagate

5. **Restart your application**

---

## ✅ Solution 2: Add Your Current IP Address

1. **Find Your IP Address**
   - Visit: https://whatismyipaddress.com/
   - Copy your IPv4 address

2. **Go to MongoDB Atlas → Network Access**

3. **Add Your IP**
   - Click "ADD IP ADDRESS"
   - Click "ADD CURRENT IP ADDRESS"
   - Or manually enter your IP
   - Add a description (e.g., "My Home IP")
   - Click "Confirm"

---

## ✅ Solution 3: Check Database User Credentials

1. **Go to Database Access** (in MongoDB Atlas)

2. **Verify User Exists**
   - Check if user `mahad7132_db_user` exists
   - If not, create a new user

3. **Create New User (if needed)**
   - Click "ADD NEW DATABASE USER"
   - Username: `mahad7132_db_user`
   - Password: `nzsMB8mvfCakNjhL` (or generate new one)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

---

## ✅ Solution 4: Verify Connection String

Your current connection string:
```
mongodb+srv://mahad7132_db_user:nzsMB8mvfCakNjhL@cluster0.ol26ghc.mongodb.net/qr-app?retryWrites=true&w=majority&appName=Cluster0
```

To get the correct connection string:

1. **Go to MongoDB Atlas Dashboard**

2. **Click "Connect" on your cluster**

3. **Choose "Connect your application"**

4. **Copy the connection string**
   - Driver: Node.js
   - Version: 5.5 or later

5. **Replace `<password>` with your actual password**

6. **Replace `<dbname>` with `qr-app`**

Example format:
```
mongodb+srv://<username>:<password>@cluster0.ol26ghc.mongodb.net/qr-app?retryWrites=true&w=majority
```

---

## ✅ Solution 5: Check Firewall/Antivirus

Sometimes Windows Firewall or antivirus blocks MongoDB connections:

1. **Temporarily disable firewall** (for testing)
2. **Try connecting again**
3. **If it works**, add exception for Node.js in firewall

---

## ✅ Solution 6: Use Alternative DNS

Sometimes DNS resolution fails. Try using Google DNS:

**Windows:**
1. Open Command Prompt as Administrator
2. Run:
```bash
ipconfig /flushdns
```

---

## 🧪 Test Connection

After making changes, test with this simple script:

Create `test-connection.js`:
```javascript
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Failed:', error.message);
    process.exit(1);
  });
```

Run:
```bash
node test-connection.js
```

---

## 📋 Quick Checklist

- [ ] IP Address added to Network Access (0.0.0.0/0 for development)
- [ ] Database user exists with correct credentials
- [ ] Connection string is correct in .env file
- [ ] Waited 1-2 minutes after making changes
- [ ] Restarted the application
- [ ] Firewall/antivirus not blocking connection

---

## 🎯 Most Common Solution

**90% of the time, it's the IP whitelist issue.**

Just add `0.0.0.0/0` to Network Access in MongoDB Atlas and wait 1-2 minutes.

---

## 📞 Still Not Working?

1. Check MongoDB Atlas status: https://status.mongodb.com/
2. Try creating a new cluster
3. Contact MongoDB support

---

## ⚡ Quick Fix Command

After adding IP to whitelist, restart your app:

```bash
# Stop the current process (Ctrl+C)
# Then restart:
npm run dev
```
