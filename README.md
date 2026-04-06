# 💰 Zorvyn Finance Dashboard Backend

🔗 **Live API:**  
https://zorvyn-fin-tech-theta.vercel.app/

---

## 🚀 Overview

Zorvyn Finance Dashboard Backend is a RESTful API built using Node.js, Express, and MongoDB.  
It provides secure endpoints for managing users, financial records, and analytics using Role-Based Access Control (RBAC).

This project simulates a real-world finance management backend with authentication, authorization, and data aggregation.

---

## ✨ Features

- 🔐 JWT-based authentication
- 🛡 Role-Based Access Control (Admin, Analyst, Viewer)
- 👤 User management with status (active/inactive)
- 💸 Financial records CRUD operations
- 🔎 Filter records by type, category, and date
- 📊 Dashboard summary (income, expenses, trends)
- 📦 MongoDB Atlas integration
- 🔁 Data seeding support
- ⚙️ Middleware-based architecture

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Token (JWT)
- dotenv
- cors

---

## 📁 Project Structure

```
project-root/
│
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── db/
├── seedData/
├── data/
├── app.js
└── package.json
```

---

## ⚙️ Setup Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Create `.env` file
```env
JWT_SECRET=your_secret_key
PORT=3000
MONGODB=your_mongodb_connection_string
```

### 3. Run the server
```bash
node index.js
```

---

## 🌱 Seed Data (Optional)

Uncomment below lines in `app.js` to seed data:

```js
// seedUser();
// seedFinanceRecord();
```

---

## 🔐 Authentication

After login, include token in request headers:

```
Authorization: <your_token>
```

---

## 🌐 Base URLs

| Environment | URL |
|------------|-----|
| Local | http://localhost:3000 |
| Production | https://zorvyn-fin-tech-theta.vercel.app |

---

### 🔐 Demo Login Credentials

| Email | Password | Role |
|------|----------|------|
| zorvynadmin@gmail.com | zorvynAdmin123 | Admin |
| soudip03panja@gmail.com | soudip@123 | Analyst |
| radha@gmail.com | radha@123 | Viewer |

---

## 📡 RESTful API Endpoints

> All endpoints follow RESTful API conventions

---

### 🔑 Auth

| Method | Route | Access | Description |
|--------|------|--------|------------|
| POST | /v1/auth/login | Public | Login and receive JWT |

---

### 💸 Financial Records

| Method | Route | Access | Description |
|--------|------|--------|------------|
| GET | /v1/finance-records | Viewer, Analyst, Admin | Get all records |
| POST | /v1/finance-records | Admin | Create record |
| POST | /v1/finance-records/:id | Admin | Update record |
| DELETE | /v1/finance-records/:id | Admin | Delete record |

---

### 🔍 Filter Records

| Method | Route | Access | Description |
|--------|------|--------|------------|
| GET | /v1/finance-records/filter | Admin | Filter records |

#### Example:

| Description | Example |
|------------|---------|
| Filter records by type | /v1/finance-records/filter?type=income |
| Filter by category | /v1/finance-records/filter?category=Food |
| Filter by date range | /v1/finance-records/filter?startDate=2026-04-03&endDate=2026-04-03 |

---

### 📊 Dashboard Summary

| Method | Route | Access | Description |
|--------|------|--------|------------|
| GET | /v1/finance-records/summary | Admin, Analyst | Dashboard analytics |

Includes:
- Total income
- Total expenses
- Net balance
- Category-wise totals
- Recent transactions
- Monthly trends

---

## 🧠 RBAC (Role-Based Access Control)

| Role | Permissions |
|------|------------|
| Admin | Full access (CRUD + analytics) |
| Analyst | Read + dashboard summary |
| Viewer | Read-only access |

---

## 🧪 Testing Guide

1. Open Postman / Thunder Client  
2. Login using user credentials  
3. Copy JWT token  
4. Add token in headers  
5. Test protected routes  

---

## ⚖️ Assumptions

- Inactive users cannot create records  
- Passwords are stored in plain text (for demo purpose)  
- Only admin can modify financial records  
- Analysts can view dashboard insights  

---

## 🚧 Future Improvements

- 🔒 Add password hashing (bcrypt)
- 📄 Swagger API documentation
- ⚡ Rate limiting
- 🧪 Unit testing
- 📊 Advanced analytics
- 🧾 Audit logging

---

## 🧠 Conclusion

This project demonstrates a strong backend system with authentication, RBAC, RESTful APIs, and financial data aggregation. It reflects real-world backend architecture used in fintech applications.

---
