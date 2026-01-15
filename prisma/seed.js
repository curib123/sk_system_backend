import bcrypt from 'bcrypt';

import { PrismaClient } from '@prisma/client';

import { PERMISSIONS } from '../src/constants/permission.constant.js';

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Super Admin...')

  /* ===============================
   * 1. UPSERT PERMISSIONS
   * =============================== */
  const permissionRecords = []

  for (const perm of PERMISSIONS) {
    const record = await prisma.permission.upsert({
      where: { key: perm.key },
      update: {},
      create: {
        key: perm.key,
        module: perm.module,
        description: `${perm.module} - ${perm.key}`,
      },
    })

    permissionRecords.push(record)
  }

  /* ===============================
   * 2. UPSERT SUPER ADMIN ROLE
   * =============================== */
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: {
      name: 'SUPER_ADMIN',
      description: 'System Super Administrator',
    },
  })

  /* ===============================
   * 3. ASSIGN ALL PERMISSIONS
   * =============================== */
  for (const permission of permissionRecords) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: permission.id,
      },
    })
  }

  /* ===============================
   * 4. CREATE DEFAULT ADMIN USER
   * =============================== */
  const passwordHash = await bcrypt.hash('Admin@12345', 10)

  await prisma.user.upsert({
    where: { email: 'admin@system.local' },
    update: {},
    create: {
      email: 'admin@system.local',
      password: passwordHash,
      fullName: 'System Super Admin',
      status: 'ACTIVE',
      roleId: superAdminRole.id,
    },
  })

  console.log('✅ Super Admin seeded successfully')
}

main()
  .catch((err) => {
    console.error('❌ Seed failed', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
