LOGIN USER

Method
POST

Endpoint
/api/auth/login

Sample Request Body
{
"email": "user@email.com
",
"password": "password123"
}

Sample Success Response (200)
{
    "success": true,
    "message": "Login successful",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidXNlckBlbWFpbC5jb20iLCJpYXQiOjE3NjgxMTEzODIsImV4cCI6MTc2ODE5Nzc4Mn0.IP0wZ1GfIV8xyJ2YHuKsERBZ7at0uTCC6w9hxzzbTqw",
        "user": {
            "id": 1,
            "email": "user@email.com",
            "fullName": "Sample User",
            "status": "ACTIVE",
            "role": {
                "id": 1,
                "name": "Super Admin",
                "permissions": [
                    "DASHBOARD_VIEW",
                    "PROCUREMENT_CREATE",
                    "PROCUREMENT_UPDATE",
                    "PROCUREMENT_APPROVE",
                    "PROCUREMENT_SOFTDELETE",
                    "REPORT_VIEW",
                    "DATA_SETUP_CREATE",
                    "DATA_SETUP_UPDATE",
                    "DATA_SETUP_SOFTDELETE",
                    "ROLE_CREATE",
                    "ROLE_UPDATE",
                    "ROLE_SOFTDELETE",
                    "ROLE_ASSIGN_PERMISSION",
                    "USER_CREATE",
                    "USER_UPDATE",
                    "USER_SOFTDELETE",
                    "USER_ASSIGN_ROLE",
                    "SYSTEM_SETTINGS_MANAGE"
                ]
            }
        }
    }
}