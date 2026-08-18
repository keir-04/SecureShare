# 🔐 SecureShare Pro

SecureShare Pro is a cross-platform secure file storage and sharing application that encrypts uploaded files using AES-256-GCM before storing them on disk. The application provides secure authentication, encrypted file storage, and transparent decryption during download.

---

## Features

- User Registration & Login
- JWT Authentication
- AES-256-GCM File Encryption
- Secure File Upload
- Secure File Download
- File Management
- SQLite Database
- Responsive React Dashboard
- Express REST API
- Windows & Linux Compatible

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend

- Node.js
- Express.js
- SQLite (better-sqlite3)
- JWT
- bcrypt
- Multer
- Node Crypto API

---

## Architecture

```
React Frontend
        │
        ▼
Express REST API
        │
        ▼
JWT Authentication
        │
        ▼
File Upload
        │
        ▼
AES-256-GCM Encryption
        │
        ▼
Encrypted Storage (.enc)
        │
        ▼
SQLite Metadata
```

---

## Project Structure

```
SecureShare-Pro
│
├── client
│   ├── src
│   ├── public
│   └── package.json
│
├── server
│   ├── controllers
│   ├── routes
│   ├── middleware
│   ├── utils
│   ├── config
│   ├── database
│   └── uploads
│
├── package.json
└── README.md
```

---

## Security Features

- AES-256-GCM Encryption
- Password Hashing using bcrypt
- JWT Authentication
- Helmet Security Headers
- Express Rate Limiting
- CORS Protection

---

## Upload Flow

```
User Upload
      │
      ▼
Temporary Storage
      │
      ▼
AES-256 Encryption
      │
      ▼
Encrypted (.enc) Storage
```

---

## Download Flow

```
Encrypted File
       │
       ▼
AES-256 Decryption
       │
       ▼
Original File Download
```

---

## Installation

```bash
git clone https://github.com/YOUR_USERNAME/SecureShare-Pro.git

cd SecureShare-Pro

npm install

cd client

npm install

cd ..

npm run dev
```

---

## Future Enhancements

- Secure Share Links
- QR Code Sharing
- Two-Factor Authentication
- Role-Based Access Control
- Cloud Storage Integration
- Activity Logs
- File Versioning

---

## Author

Developed as a Secure File Storage System using React, Node.js, Express, SQLite, and AES-256-GCM Encryption.