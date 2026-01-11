export const PERMISSIONS = [
  { key: 'DASHBOARD_VIEW', module: 'DASHBOARD' },

  { key: 'PROCUREMENT_CREATE', module: 'PROCUREMENT' },
  { key: 'PROCUREMENT_UPDATE', module: 'PROCUREMENT' },
  { key: 'PROCUREMENT_APPROVE', module: 'PROCUREMENT' },
  { key: 'PROCUREMENT_SOFTDELETE', module: 'PROCUREMENT' },

  { key: 'REPORT_VIEW', module: 'REPORT' },

  { key: 'DATA_SETUP_CREATE', module: 'DATA_SETUP' },
  { key: 'DATA_SETUP_UPDATE', module: 'DATA_SETUP' },
  { key: 'DATA_SETUP_SOFTDELETE', module: 'DATA_SETUP' },

  { key: 'ROLE_CREATE', module: 'ROLES_PERMISSION' },
  { key: 'ROLE_UPDATE', module: 'ROLES_PERMISSION' },
  { key: 'ROLE_SOFTDELETE', module: 'ROLES_PERMISSION' },
  { key: 'ROLE_ASSIGN_PERMISSION', module: 'ROLES_PERMISSION' },

  { key: 'USER_CREATE', module: 'USER_MANAGEMENT' },
  { key: 'USER_UPDATE', module: 'USER_MANAGEMENT' },
  { key: 'USER_SOFTDELETE', module: 'USER_MANAGEMENT' },
  { key: 'USER_ASSIGN_ROLE', module: 'USER_MANAGEMENT' },

  { key: 'SYSTEM_SETTINGS_MANAGE', module: 'SYSTEM_SETTINGS' },
];
