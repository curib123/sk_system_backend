Get All Budget Allocations

Retrieve all budget allocations.

Endpoint

GET /api/budget-allocations

Success Response (200)
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "allocatedAmount": "500000.00",
      "usedAmount": "200000.00",
      "budget": { "id": 1, "totalAmount": "2000000.00" },
      "program": { "id": 2, "name": "Health Program" },
      "classification": { "id": 3, "name": "Operating Expenses" },
      "object": { "id": 4, "name": "Supplies" }
    }
  ]
}

Error Response (500)
{
  "success": false,
  "message": "Internal server error"
}
