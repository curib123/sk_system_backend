TOGGLE PROGRAM STATUS

Method
PATCH

Endpoint
/api/programs/toggle-status/:id

Sample Success Response (200)

{
  "success": true,
  "data": {
    "id": 1,
    "isActive": false
  }
}