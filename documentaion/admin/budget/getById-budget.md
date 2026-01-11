Get Budget by ID

Retrieve a single budget including its allocations.

Endpoint
GET /api/budgets/:id

URL Params
Name	Type	Required
id	number	✅
Success Response (200)
{
  "success": true,
  "data": {
    "id": 1,
    "totalAmount": "5000000.00",
    "fiscalYear": {
      "id": 1,
      "year": 2025
    },
    "allocations": [],
    "createdAt": "2026-01-11T08:20:00.000Z",
    "updatedAt": "2026-01-11T08:20:00.000Z"
  }
}

Error Response (404)
{
  "success": false,
  "message": "Budget not found"
}