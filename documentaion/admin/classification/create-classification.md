Create Classification

Create a new budget classification with a required budget limit.

Endpoint

POST /api/classifications

Request Body
{
  "code": "BC-001",
  "name": "General Services",
  "description": "General operating expenses",
  "budgetId": 1,
  "limitAmount": 300000
}

Success Response (201)
{
    "success": true,
    "message": "Classification created with budget limit",
    "data": {
        "id": 5,
        "code": "BC-001",
        "name": "General Services",
        "description": "General operating expenses",
        "createdAt": "2026-01-12T02:28:03.130Z",
        "updatedAt": "2026-01-12T02:28:03.130Z",
        "deletedAt": null,
        "limit": {
            "id": 1,
            "budgetId": 2,
            "classificationId": 5,
            "limitAmount": "300000",
            "createdAt": "2026-01-12T02:28:03.134Z",
            "updatedAt": "2026-01-12T02:28:03.134Z"
        }
    }
}

Error Response (400)
{
  "success": false,
  "message": "Code, name, budgetId, and limitAmount are required"
}

Error Response (400)
{
  "success": false,
  "message": "Classification code or name already exists"
}

Error Response (400)
{
  "success": false,
  "message": "Limit amount exceeds remaining budget. Remaining budget: 200000"
}

Error Response (400)
{
  "success": false,
  "message": "Budget not found"
}
