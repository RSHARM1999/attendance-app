# GOOGLE OAUTH SETUP GUIDE

## Step 1: Create Google OAuth Credentials

1. Go to https://console.cloud.google.com/
2. Create a new project (Name: "Attendance App")
3. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
4. Select "Web application"
5. Add authorized redirect URI: `http://localhost:5000/auth/google/callback`
6. Copy the Client ID and Client Secret

## Step 2: Set Environment Variables

Create a `.env` file in the root directory:

```
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
PORT=5000
```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Run the Server

```bash
npm start
```

## Step 5: Access the App

- Open: http://localhost:5000
- Click "Sign in with Google"
- Use your @decathlon.com email

## Features

✅ Google OAuth Sign-in (only @decathlon.com emails allowed)
✅ Session management with Passport.js
✅ Mark attendance (Present, Absent, Leave, Half-Day)
✅ View attendance history
✅ Statistics dashboard
✅ Auto-logout with session

## Database Schema

### users table
- id (INTEGER PRIMARY KEY)
- email (TEXT UNIQUE)
- name (TEXT)
- googleId (TEXT UNIQUE)
- loginMethod (TEXT) - 'google' or 'email'
- createdAt (DATETIME)

### attendance table
- id (INTEGER PRIMARY KEY)
- userId (INTEGER)
- date (DATE)
- status (TEXT)
- notes (TEXT)

## API Endpoints

- `GET /` - Home page (redirects to login or dashboard)
- `GET /auth/google` - Start Google OAuth flow
- `GET /auth/google/callback` - Google OAuth callback
- `GET /dashboard` - Dashboard (requires auth)
- `GET /api/user` - Get current user info
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance` - Get attendance history
- `GET /api/stats` - Get statistics
- `GET /logout` - Logout

## Security Notes

⚠️ Only @decathlon.com email addresses can sign in
⚠️ Sessions are stored in memory (use persistent store in production)
⚠️ Never commit .env file with real credentials
