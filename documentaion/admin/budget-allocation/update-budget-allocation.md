Update Budget Allocation

Update an existing budget allocation.

Endpoint

PUT /api/budget-allocations/:id

Request Body
{
  "allocatedAmount": 750000.00,
  "usedAmount": 300000.00
}

Success Response (200)
{
  "success": true,
  "message": "Budget allocation updated successfully",
  "data": {
    "id": 1,
    "allocatedAmount": "750000.00",
    "usedAmount": "300000.00",
    "updatedAt": "2026-01-12T01:30:00.000Z"
  }
}

Error Response (400)
{
  "success": false,
  "message": "Used amount cannot exceed allocated amount"
}
