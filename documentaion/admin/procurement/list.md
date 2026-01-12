List Procurement Requests

Retrieve all procurement requests.

Endpoint

GET /api/procurement

Success Response (200)
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Office Supplies",
      "status": "COMPLETED",
      "amount": 25000
    }
  ]
}

Error Response (500)
{
  "success": false,
  "message": "Internal server error"
}
