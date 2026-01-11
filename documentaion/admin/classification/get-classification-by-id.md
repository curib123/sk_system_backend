Get Classification by ID

Retrieve a specific classification using its ID.

Endpoint

GET /api/classifications/:id

URL Params
Param	Type	Description
id	number	Classification ID
Success Response (200)
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

Error Response (404)
{
  "success": false,
  "message": "Classification not found"
}