Update Classification

Update an existing budget classification.

Endpoint

PUT /api/classifications/:id

URL Params
Param	Type	Description
id	number	Classification ID
Request Body
{
  "code": "BC-002",
  "name": "Administrative Expenses",
  "description": "Office and admin-related expenses"
}

Success Response (200)
{
    "success": true,
    "data": {
        "id": 1,
        "code": "BC-002",
        "name": "Administrative Expenses",
        "description": "Office and admin-related expenses",
        "createdAt": "2026-01-11T12:49:43.179Z",
        "updatedAt": "2026-01-11T12:56:34.220Z",
        "deletedAt": null
    }
}
Error Response (400)
{
  "success": false,
  "message": "Classification not found"
}
