# sk_system_backend# 🚀 SK System Backend (Express + Prisma + MySQL)

This is the backend API for **SK System**, built with **Express.js**, **Prisma ORM**, **MySQL**, and **JWT Authentication**.  
It supports **Role-Based Access Control (RBAC)**, **Budgeting**, **Procurement**, **Approval Workflow**, and **System Settings**.

---

## 🛠 Tech Stack

- Node.js
- Express.js
- Prisma ORM
- MySQL
- JWT Authentication
- bcrypt
- ES Modules

---

## 📁 Project Structure

```
sk_system_backend/
├─ prisma/
│  └─ schema.prisma
├─ src/
│  ├─ controllers/
│  ├─ services/
│  ├─ routes/
│  ├─ middlewares/
│  ├─ config/
│  │  └─ db.config.js
│  └─ app.js
├─ server.js
├─ .env
├─ package.json
└─ README.md
```

---

## ✅ Prerequisites

- Node.js (v18+ recommended)
- MySQL (v8+)
- npm or yarn

---

## 📦 Installation Guide

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/curib123/sk_system_backend.git
cd sk_system_backend
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="mysql://root@localhost:3306/sk_system_db"
PORT=3001
NODE_ENV=development

JWT_SECRET="super_secret_jwt_key_change_this"
JWT_EXPIRES_IN="1d"

BCRYPT_SALT_ROUNDS=10
```

⚠️ Never commit `.env` to version control.

---

## 🗄 Database Setup

### Create Database

```sql
CREATE DATABASE sk_system_db;
```

---

## 🧬 Prisma Migration Guide

### Generate Prisma Client

```bash
npx prisma generate
```

---

### Initial Migration

```bash
npx prisma migrate dev --name init
```

This will:
- Create tables
- Apply relations
- Sync Prisma client

---

### Future Migrations

```bash
npx prisma migrate dev --name your_migration_name
```

Example:
```bash
npx prisma migrate dev --name add_budget_module
```

---

### Prisma Studio (Optional)

```bash
npx prisma studio
```

---

## ▶️ Running the Server

```bash
npm run dev
```

Server will start at:
```
http://localhost:3001
```

---

## 🔐 Authentication

- JWT-based authentication
- Token sent via:
```
Authorization: Bearer <token>
```

---

## 🔑 Role & Permission System

- One role per user
- Multiple permissions per role
- Module-based permissions

---

## 💰 Budget & Procurement

Includes:
- Fiscal Year
- Total Budget
- Budget Allocation
- Procurement Requests
- Approval Workflow

---

## 🧠 Soft Delete

Records are soft deleted using:
```
deletedAt DateTime?
```

---

## 🧪 API Testing

Recommended tools:
- Postman
- Insomnia

Ensure headers:
```
Content-Type: application/json
Authorization: Bearer <token>
```

---

## 🚀 Production Notes

- Set NODE_ENV=production
- Use strong JWT_SECRET
- Use production DB
- Add rate limiting

---

## 📌 Common Commands

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

