Dashboard Overview

Get all dashboard analytics, KPIs, charts data, activities, and system logs in a single endpoint.

Endpoint

GET /api/dashboard/overview

Request Parameters

None

Success Response (200)

{
  "success": true,
  "data": {
    "fiscalYear": {
      "id": 1,
      "year": 2027,
      "isActive": true
    },

    "users": {
      "total": 2,
      "byStatus": [
        {
          "status": "ACTIVE",
          "_count": { "id": 2 }
        }
      ],
      "byRole": [
        {
          "roleId": 1,
          "_count": { "id": 1 }
        },
        {
          "roleId": 6,
          "_count": { "id": 1 }
        }
      ]
    },

    "budget": {
      "id": 2,
      "total": 5000000,
      "allocated": 8000,
      "used": 0,
      "remaining": 5000000,
      "utilizationRate": "0.00"
    },

    "procurement": [
      {
        "status": "DRAFT",
        "_count": { "id": 1 },
        "_sum": { "amount": 8000 }
      },
      {
        "status": "SUBMITTED",
        "_count": { "id": 0 },
        "_sum": { "amount": 0 }
      },
      {
        "status": "APPROVED",
        "_count": { "id": 0 },
        "_sum": { "amount": 0 }
      },
      {
        "status": "COMPLETED",
        "_count": { "id": 0 },
        "_sum": { "amount": 0 }
      }
    ],

    "approvals": [
      {
        "status": "PENDING",
        "_count": { "id": 1 }
      },
      {
        "status": "APPROVED",
        "_count": { "id": 0 }
      },
      {
        "status": "REJECTED",
        "_count": { "id": 0 }
      }
    ],

    "logs": {
      "recent": [
        {
          "id": 10,
          "level": "INFO",
          "message": "Dashboard accessed",
          "context": "GET /api/dashboard",
          "createdAt": "2026-01-12T05:21:00.000Z",
          "user": {
            "id": 1,
            "fullName": "System Admin"
          }
        },
        {
          "id": 9,
          "level": "WARNING",
          "message": "Low budget allocation detected",
          "context": "BudgetAllocationService",
          "createdAt": "2026-01-11T09:10:00.000Z",
          "user": {
            "id": 1,
            "fullName": "System Admin"
          }
        }
      ],
      "summary": [
        {
          "level": "INFO",
          "_count": { "id": 15 }
        },
        {
          "level": "WARNING",
          "_count": { "id": 3 }
        },
        {
          "level": "ERROR",
          "_count": { "id": 0 }
        }
      ]
    }
  }
}


Error Response (500)

{
  "success": false,
  "message": "Failed to load dashboard data"
}
