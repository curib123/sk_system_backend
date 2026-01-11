Create Classification

Create a new budget classification.

Endpoint

POST /api/classifications

Request Body
{
  "code": "BC-001",
  "name": "General Services",
  "description": "General operating expenses"
}

Success Response (201)
{
    "success": true,
    "data": {
        "id": 1,
        "code": "BC-001",
        "name": "General Services",
        "description": "General operating expenses",
        "createdAt": "2026-01-11T12:49:43.179Z",
        "updatedAt": "2026-01-11T12:49:43.179Z",
        "deletedAt": null
    }
}
Error Response (400)
{
  "success": false,
  "message": "Classification code or name already exists"
}