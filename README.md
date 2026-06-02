# Attendance Tracker Web App

A modern, full-stack web application for tracking attendance with user authentication, attendance marking, and statistics.

## Features

✅ **User Authentication**
- Register with name, email, and password
- Secure login with JWT tokens
- Password hashing with bcrypt

✅ **Mark Attendance**
- Mark attendance for any date
- Three status options: Present, Absent, Leave
- Add optional notes for each attendance

✅ **View History**
- See all attendance records in chronological order
- Filter by month
- Color-coded status indicators

✅ **Statistics Dashboard**
- Total attendance count
- Present/Absent/Leave breakdown
- Real-time stats updates

✅ **Responsive Design**
- Works on desktop, tablet, and mobile
- Clean, modern UI with gradient theme

## Tech Stack

**Frontend:**
- HTML5
- CSS3 (Responsive)
- Vanilla JavaScript (ES6+)

**Backend:**
- Node.js with Express.js
- SQLite3 database
- JWT for authentication
- Bcrypt for password hashing

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/RSHARM1999/attendance-app.git
   cd attendance-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5000
   ```

## Usage

### First Time Users
1. Click on "Register" link
2. Enter your name, email, and password
3. Click "Register"
4. You'll be logged in automatically

### Marking Attendance
1. Select the date from the date picker (defaults to today)
2. Choose status: Present, Absent, or On Leave
3. Add optional notes
4. Click "Submit Attendance"

### Viewing History
1. All your attendance records are shown in the "Attendance History" section
2. Use the month filter to narrow down records
3. Records are color-coded by status

### Viewing Statistics
1. The dashboard shows:
   - Total attendance entries
   - Count of Present days
   - Count of Absent days
   - Count of Leave days

## Database Schema

### Users Table
```sql
- id (PRIMARY KEY)
- name
- email (UNIQUE)
- password (hashed)
- created_at
```

### Attendance Table
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- date
- status (present/absent/leave)
- notes
- created_at
```

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Attendance (Protected - requires token)
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance` - Get all attendance records
- `GET /api/stats` - Get attendance statistics

## Project Structure

```
attendance-app/
├── server.js           # Express server
├── package.json        # Dependencies
├── attendance.db       # SQLite database (created on first run)
└── public/
    ├── index.html      # Main HTML file
    ├── styles.css      # Stylesheet
    └── app.js          # Frontend JavaScript
```

## Security Notes

⚠️ **For Production:**
1. Change the JWT_SECRET in `server.js` to a strong, random string
2. Use environment variables for sensitive data
3. Enable HTTPS
4. Add rate limiting
5. Implement CORS properly
6. Use a production database (PostgreSQL, MySQL)

## Future Enhancements

- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Export reports (PDF/Excel)
- [ ] Team/Department management
- [ ] Leave approval workflow
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Two-factor authentication

## Troubleshooting

**Port already in use?**
```bash
PORT=3000 npm start
```

**Database locked error?**
- Close the app
- Delete `attendance.db`
- Restart the server

**Can't connect to server?**
- Make sure server is running on `http://localhost:5000`
- Check if port 5000 is available
- Check browser console for errors

## License

MIT License - Feel free to use this project for personal or commercial use.

## Support

If you encounter any issues, please create an issue in the GitHub repository.
