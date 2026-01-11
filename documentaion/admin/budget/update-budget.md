Update Budget

Update total amount or fiscal year of a budget.

Endpoint
PUT /api/budgets/:id

URL Params
Name	Type	Required
id	number	✅
Request Body
{
  "totalAmount": 7500000.00
}

Success Response (200)
{
  "success": true,
  "message": "Budget updated successfully",
  "data": {
    "id": 1,
    "totalAmount": "7500000.00",
    "updatedAt": "2026-01-11T09:10:00.000Z"
  }
}

Error Response (400)
{
  "success": false,
  "message": "Invalid budget data"
}