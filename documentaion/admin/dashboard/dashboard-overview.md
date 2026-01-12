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
      "year": 2025,
      "isActive": true
    },

    "kpis": {
      "users": [
        { "status": "ACTIVE", "count": 15 },
        { "status": "INACTIVE", "count": 3 },
        { "status": "SUSPENDED", "count": 1 }
      ],

      "programs": {
        "total": 12,
        "active": 10
      },

      "budget": {
        "totalAmount": 25000000,
        "allocatedAmount": 20000000,
        "usedAmount": 14500000,
        "remainingFromAllocated": 5500000,
        "remainingFromTotal": 10500000
      },

      "approvals": {
        "pending": 6,
        "approved": 18,
        "rejected": 2
      }
    },

    "budgetClassificationLimits": [
      {
        "classificationId": 1,
        "classification": "MOOE",
        "limitAmount": 8000000,
        "allocatedAmount": 6200000,
        "usedAmount": 5100000,
        "remaining": 1100000
      }
    ],

    "procurement": {
      "byStatus": [
        {
          "status": "DRAFT",
          "count": 4,
          "totalAmount": 120000
        },
        {
          "status": "APPROVED",
          "count": 8,
          "totalAmount": 890000
        }
      ],

      "monthlyTrend": [
        {
          "month": "2026-01",
          "count": 6,
          "totalAmount": 340000
        }
      ]
    },

    "activity": {
      "recentRequests": [
        {
          "id": 10,
          "title": "Office Supplies Q1",
          "status": "APPROVED",
          "amount": 50000,
          "program": "Administrative Services",
          "createdBy": "Juan Dela Cruz",
          "createdAt": "2026-01-11T10:20:00.000Z"
        }
      ],

      "recentLogs": [
        {
          "id": 5,
          "level": "INFO",
          "message": "User logged in",
          "context": "AUTH",
          "user": "Admin User",
          "createdAt": "2026-01-11T11:45:00.000Z"
        }
      ]
    }
  },
  "timestamp": "2026-01-12T04:15:30.000Z"
}


Error Response (500)

{
  "success": false,
  "message": "Failed to load dashboard data"
}
