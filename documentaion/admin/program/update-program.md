UPDATE PROGRAM

Method
PUT

Endpoint
/api/programs/:id

Sample Request Body

{
  "name": "Updated Scholarship Program",
  "description": "Updated description",
  "isActive": true
}


Sample Success Response (200)

{
  "success": true,
  "data": {
    "id": 1,
    "name": "Updated Scholarship Program",
    "description": "Updated description",
    "isActive": true,
    "updatedAt": "2026-01-11T10:15:00.000Z"
  }
}