import { Router } from 'express';

import {
  createRole,
  deleteRole,
  getRoleById,
  getRolePermissions,
  getRoles,
  updateRole,
} from '../controllers/role.controller.js';

const router = Router();

router.post("/", createRole);
router.get("/", getRoles);
router.get("/:id", getRoleById);
router.put("/:id", updateRole);
router.delete("/:id", deleteRole);

router.get("/:id/permissions", getRolePermissions);

export default router;
