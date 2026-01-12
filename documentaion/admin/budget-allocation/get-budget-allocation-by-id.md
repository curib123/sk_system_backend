Get Budget Allocation By ID

Retrieve a specific budget allocation.

Endpoint

GET /api/budget-allocations/:id

Success Response (200)
{
  "success": true,
  "data": {
    "id": 1,
    "allocatedAmount": "500000.00",
    "usedAmount": "200000.00",
    "budget": { "id": 1 },
    "program": { "id": 2 },
    "classification": { "id": 3 },
    "object": { "id": 4 }
  }
}

Error Response (404)
{
  "success": false,
  "message": "Budget allocation not found"
}
