🚀 SK System Backend

Express + Prisma + MySQL

Backend API for SK System, built with Express.js, Prisma ORM, MySQL, and JWT Authentication.
Supports Role-Based Access Control (RBAC), Budgeting, Procurement, Approval Workflow, and System Settings.

🛠 Tech Stack

Node.js (v18+)

Express.js

Prisma ORM

MySQL

JWT Authentication

bcrypt

ES Modules

📁 Project Structure
sk_system_backend/
├─ prisma/
│  ├─ schema.prisma
│  ├─ seed.js
│  └─ prisma.config.ts
├─ src/
│  ├─ controllers/
│  ├─ services/
│  ├─ routes/
│  ├─ middlewares/
│  ├─ constants/
│  │  └─ permission.constant.js
│  ├─ config/
│  │  └─ db.config.js
│  └─ app.js
├─ server.js
├─ .env
├─ package.json
└─ README.md

✅ Prerequisites

Node.js v18+

MySQL v8+

npm or yarn

📦 Installation Guide
1️⃣ Clone the Repository
git clone https://github.com/curib123/sk_system_backend.git
cd sk_system_backend

2️⃣ Install Dependencies
npm install

3️⃣ Environment Variables

Create a .env file in the root directory:

DATABASE_URL="mysql://root@localhost:3306/sk_system_db"
PORT=3001
NODE_ENV=development

JWT_SECRET="super_secret_jwt_key_change_this"
JWT_EXPIRES_IN="1d"

BCRYPT_SALT_ROUNDS=10


⚠️ Never commit .env to version control

🗄 Database Setup
Create Database
CREATE DATABASE sk_system_db;

🧬 Prisma Setup & Migration
Generate Prisma Client
npx prisma generate

Initial Migration
npx prisma migrate dev --name init


This will:

Create all tables

Apply relations

Sync Prisma Client

Future Migrations
npx prisma migrate dev --name your_migration_name


Example:

npx prisma migrate dev --name add_budget_module

Prisma Studio (Optional)
npx prisma studio

🌱 Database Seeding (IMPORTANT)

This project includes a default SUPER ADMIN seed.

What the seed creates

✅ All permissions (from permission.constant.js)

✅ SUPER_ADMIN role

✅ All permissions assigned to SUPER_ADMIN

✅ Default admin user

Default Admin Account
Email: admin@system.local
Password: Admin@12345
Role: SUPER_ADMIN


⚠️ Change the password immediately after first login

Run the Seed
npx prisma db seed


Expected output:

🌱 Seeding Super Admin...
✅ Super Admin seeded successfully


The seed is idempotent — safe to run multiple times.

▶️ Running the Server
Development
npm run dev


Server will start at:

http://localhost:3001

🔐 Authentication

JWT-based authentication

Token sent via header:

Authorization: Bearer <token>

🔑 Role & Permission System (RBAC)

One role per user

Multiple permissions per role

Module-based permission design

Permissions defined in:

src/constants/permission.constant.js


Example:

{ key: 'PROCUREMENT_APPROVE', module: 'PROCUREMENT' }

💰 Budget & Procurement Modules

Includes:

Fiscal Year

Total Budget

Budget Classification Limits

Budget Allocation

Procurement Requests

Approval Workflow

Proof Uploads

🧠 Soft Delete Strategy

Most tables support soft deletion using:

deletedAt DateTime?


Soft-deleted records are excluded at the application level.

🧪 API Testing

Recommended tools:

Postman

Insomnia

Required headers:

Content-Type: application/json
Authorization: Bearer <token>

🚀 Production Notes

Set NODE_ENV=production

Use a strong JWT_SECRET

Use a production database

Enable:

Rate limiting

Request validation

Centralized logging

📌 Common Commands
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev

🔐 Security Reminder

❗ Delete or rotate the default admin account in production