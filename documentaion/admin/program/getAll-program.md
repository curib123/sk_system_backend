GET ALL PROGRAMS

Method
GET

Endpoint
/api/programs

Sample Success Response (200)

{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "PRG-001",
      "name": "Scholarship Program",
      "isActive": true
    },
    {
      "id": 2,
      "code": "PRG-002",
      "name": "Health Assistance Program",
      "isActive": false
    }
  ]
}