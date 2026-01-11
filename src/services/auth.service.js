import { db } from '../config/db.config.js';
import { generateToken } from '../utils/jwt.util.js';
import {
  comparePassword,
  hashPassword,
} from '../utils/password.util.js';

/* =========================
   REGISTER USER
========================= */
export const registerUser = async ({ email, password, fullName }) => {
  const exists = await db.user.findFirst({
    where: { email, deletedAt: null },
  });

  if (exists) {
    throw new Error('Email already exists');
  }

  const hashed = await hashPassword(password);

  return db.user.create({
    data: {
      email,
      password: hashed,
      fullName,
    },
  });
};

/* =========================
   LOGIN USER
========================= */
export const loginUser = async ({ email, password }) => {
  const user = await db.user.findFirst({
    where: { email, deletedAt: null },
    include: {
      roles: {
        where: { deletedAt: null },
        include: {
          role: {
            include: {
              permissions: {
                where: { deletedAt: null },
                include: { permission: true },
              },
            },
          },
        },
      },
    },
  });

  if (!user) throw new Error('Invalid credentials');
  if (user.status !== 'ACTIVE')
    throw new Error(`Account ${user.status}`);

  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new Error('Invalid credentials');

  const roles = user.roles.map(r => ({
    id: r.role.id,
    name: r.role.name,
    permissions: r.role.permissions.map(p => p.permission.key),
  }));

  const token = generateToken({
    userId: user.id,
    email: user.email,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      status: user.status,
      roles,
    },
  };
};

/* =========================
   GET CURRENT USER
========================= */
export const getMeService = async (userId) => {
  const user = await db.user.findFirst({
    where: {
      id: userId,
      deletedAt: null,
    },
    include: {
      roles: {
        where: { deletedAt: null },
        include: {
          role: {
            include: {
              permissions: {
                where: { deletedAt: null },
                include: { permission: true },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (user.status !== 'ACTIVE') {
    throw new Error(`Account ${user.status}`);
  }

  const roles = user.roles.map(r => ({
    id: r.role.id,
    name: r.role.name,
    permissions: r.role.permissions.map(p => p.permission.key),
  }));

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    status: user.status,
    roles,
    createdAt: user.createdAt,
  };
};