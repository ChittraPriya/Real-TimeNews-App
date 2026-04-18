#  News Alert System - Backend

A powerful **Node.js + Express + MongoDB backend** for the Real-Time News Alert System.

This backend handles authentication, news management, real-time alerts, user preferences, email notifications, admin controls, and scheduled news updates.

---

#  Features

##  Authentication

- User Registration
- User Login
- JWT Token Authentication
- Protected Routes
- Role-based Access (User / Admin)

---

##  News Management

- Add News (Admin)
- Edit News
- Delete News
- Get All News
- Category Filtering

---

##  Alerts System

- Create Alerts Automatically
- Store Alerts in MongoDB
- Mark as Read
- Mark All as Read
- Delete Single Alert
- Delete All Alerts
- Unread Count API

---

##  User Preferences

Users can customize:

### Categories

- Technology
- Sports
- Business
- Health
- Science
- Entertainment
- Politics
- World

### Frequency

- Immediate
- Hourly
- Daily

### Notification Types

- Email Alerts
- Push Notifications

---

##  Email Notification Service

Integrated with Nodemailer.

Sends:

- Breaking News Emails
- Category Based News Alerts
- HTML Email Templates

---

##  Real-Time Updates

Implemented using:

- Socket.IO
- Live alert broadcasting
- Instant badge updates

---

##  Scheduled Jobs

Using Node Cron:

- Fetch news automatically
- Match user preferences
- Generate alerts
- Send emails

---

#  Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Socket.IO
- Nodemailer
- Node Cron
- bcrypt.js
- dotenv

---
