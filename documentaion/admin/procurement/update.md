Update Procurement Request

Update an existing procurement request (DRAFT only).

Endpoint

PUT /api/procurement/:id

Request Body
{
  "title": "Updated Office Supplies",
  "description": "Updated procurement description"
}

Success Response (200)
{
  "success": true,
  "message": "Procurement request updated successfully",
  "data": {
    "id": 1,
    "status": "DRAFT"
  }
}

Error Response (400)
{
  "success": false,
  "message": "Only draft requests can be updated"
}
