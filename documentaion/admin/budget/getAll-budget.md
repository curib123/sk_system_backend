Get All Budgets

Retrieve all active (non-deleted) budgets.

Endpoint
GET /api/budgets

Success Response (200)
{
  "success": true,
  "data": [
    {
      "id": 1,
      "totalAmount": "5000000.00",
      "fiscalYear": {
        "id": 1,
        "year": 2025,
        "isActive": true
      },
      "createdAt": "2026-01-11T08:20:00.000Z",
      "updatedAt": "2026-01-11T08:20:00.000Z"
    }
  ]
}

Error Response (500)
{
  "success": false,
  "message": "Internal server error"
}
