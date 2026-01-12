Create Procurement Request

Create a new procurement request.

Endpoint

POST /api/procurement

Request Body
{
  "title": "Office Supplies Purchase",
  "description": "Procurement of office materials",
  "amount": 25000,
  "allocationId": 3,
  "vendorId": 2,
  "items": [
    {
      "name": "Bond Paper",
      "quantity": 10,
      "unitCost": 250
    }
  ]
}

Success Response (201)
{
  "success": true,
  "message": "Procurement request created successfully",
  "data": {
    "id": 1,
    "title": "Office Supplies Purchase",
    "status": "DRAFT",
    "amount": 25000
  }
}

Error Response (400)
{
  "success": false,
  "message": "Invalid allocation or data"
}
