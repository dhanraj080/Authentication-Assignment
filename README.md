## Project Description
This full-stack application consists of a **React.js frontend** and **Node.js backend**. It implements **user authentication with OTP verification**, **account creation**, and **account deletion**, along with proper **form validation and error handling**.

## Features

### Login
- Capture **email** and **password** input from users.
- Validate credentials against the database.
- Generate a **6-digit numerical OTP** (expires in 10 minutes) for additional authentication.
- Redirect users post-OTP verification to a **Thank You page** with personalized welcome message and account details.
- Handle incorrect login attempts with an error page: *“Sorry, we can't log you in.”*

### New User Registration
- “Create Account” button navigates to a registration form.
- Collect **name, email, password, company name, age, DOB**, and **mandatory image upload** (PNG or JPG).
- Validate email format and ensure **case-sensitive password**.
- Store uploaded images in the database, linked to the user’s email.

### Account Management
- Users can **delete their accounts** via a “Remove Account” feature on the Thank You page.

## Tech Stack
- **Frontend:** React.js or Next.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB or your choice for user data & images
- **Authentication:** JWT + OTP verification

## Project Structure
```
root/
│
├── backend/
│   ├── config/       # Database configuration
│   ├── controllers/  # Main logic
│   ├── models/       # User schemas
│   ├── routes/       # Application routes
│   ├── middleware/   # Auth & validation middleware
│   └── app.js        # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/ # API calls
    │   └── App.js
    └── package.json
```

## Installation

### Clone the repository
```bash
git clone https://github.com/dhanraj080/Authentication-Assignment.git
cd Authentication-Assignment
```

### Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in `backend/` with:
```env
MONGO_URI=<your_mongo_connection_string>
JWT_SECRET=<your_jwt_secret>
PORT=3000
```
Run backend:
```bash
node app.js
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Usage
1. Open backend in browser (e.g., `http://localhost:3000`).
2. Register a new user or log in with existing credentials.
3. Verify OTP for login.
4. Access personalized account info and manage account.

## Demo / Hosted Links
- Frontend: [https://authentication-assignment-0fmx.onrender.com/](https://authentication-assignment-0fmx.onrender.com/)
- Backend API: [authentication-assignment-one.vercel.app](authentication-assignment-one.vercel.app)

