Update Classification

Update an existing budget classification and its budget limit.

Endpoint

PUT /api/classifications/:id

URL Params
Param   Type    Description
id      number  Classification ID

Request Body
{
  "name": "Administrative Expenses",
  "description": "Office and admin-related expenses",
  "limitAmount": 350000
}

Success Response (200)
{
    "success": true,
    "message": "Classification and limit updated successfully",
    "data": {
        "id": 5,
        "code": "BC-001",
        "name": "Administrative Expenses",
        "description": "Office and admin-related expenses",
        "createdAt": "2026-01-12T02:28:03.130Z",
        "updatedAt": "2026-01-12T02:30:03.297Z",
        "deletedAt": null,
        "limit": {
            "id": 1,
            "budgetId": 2,
            "classificationId": 5,
            "limitAmount": "350000",
            "createdAt": "2026-01-12T02:28:03.134Z",
            "updatedAt": "2026-01-12T02:30:03.301Z"
        }
    }
}
Error Response (400)
{
  "success": false,
  "message": "No data provided for update"
}

Error Response (400)
{
  "success": false,
  "message": "Classification not found"
}

Error Response (400)
{
  "success": false,
  "message": "Limit amount must be greater than zero"
}

Error Response (400)
{
  "success": false,
  "message": "Limit amount exceeds remaining budget. Remaining budget: 400000"
}

Error Response (400)
{
  "success": false,
  "message": "Cannot change classification code while it is used in budget limits"
}
