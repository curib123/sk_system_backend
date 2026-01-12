Create Budget Allocation

Create a new budget allocation.

Endpoint

POST /api/budget-allocations

Request Body
{
  "budgetId": 1,
  "programId": 2,
  "classificationId": 3,
  "objectOfExpenditureId": 4,
  "allocatedAmount": 500000.00
}

Success Response (201)
{
  "success": true,
  "message": "Budget allocation created successfully",
  "data": {
    "id": 1,
    "budgetId": 1,
    "programId": 2,
    "classificationId": 3,
    "objectOfExpenditureId": 4,
    "allocatedAmount": "500000.00",
    "usedAmount": "0.00",
    "createdAt": "2026-01-12T01:00:00.000Z",
    "updatedAt": "2026-01-12T01:00:00.000Z",
    "deletedAt": null
  }
}

Error Response (400)
{
  "success": false,
  "message": "Missing required fields"
}
