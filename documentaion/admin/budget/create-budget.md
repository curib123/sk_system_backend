Create Total Budget

Create a new total budget for a fiscal year.

Endpoint
POST /api/budgets

Request Body
{
  "fiscalYearId": 1,
  "totalAmount": 5000000.00
}

Success Response (201)
{
  "success": true,
  "message": "Total budget created successfully",
  "data": {
    "id": 1,
    "fiscalYearId": 1,
    "totalAmount": "5000000.00",
    "createdAt": "2026-01-11T08:20:00.000Z",
    "updatedAt": "2026-01-11T08:20:00.000Z"
  }
}

Error Response (400)
{
  "success": false,
  "message": "Budget for this fiscal year already exists"
}
