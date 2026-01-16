📄 List Procurement Requests

Retrieve procurement requests with search, status filtering, and pagination.

🔗 Endpoint
GET /api/procurement

🔍 Query Parameters
Parameter	Type	Description
q	string	Search by request title (optional)
status	string	Filter by request status (optional)
page	number	Page number (default: 1)
limit	number	Items per page (default: 10)
✅ Valid status values
DRAFT
SUBMITTED
APPROVED
REJECTED
PURCHASED
COMPLETED

📌 Example Requests
GET /api/procurement

GET /api/procurement?status=DRAFT

GET /api/procurement?q=office&page=1&limit=10

GET /api/procurement?status=APPROVED&page=2

✅ Success Response (200)
{
  "success": true,
  "data": [
    {
      "id": 3,
      "title": "sss",
      "description": "ss",
      "amount": "1068",
      "status": "DRAFT",
      "allocationId": 4,
      "vendorId": null,
      "createdById": 6,
      "createdAt": "2026-01-16T03:09:58.536Z",
      "updatedAt": "2026-01-16T03:09:58.536Z",
      "deletedAt": null,
      "items": [
        {
          "id": 2,
          "requestId": 3,
          "name": "sss",
          "description": null,
          "quantity": 5,
          "unitCost": "120",
          "totalPrice": "600",
          "createdAt": "2026-01-16T03:09:58.536Z",
          "deletedAt": null
        }
      ],
      "approvals": [],
      "proofs": [],
      "vendor": null,
      "allocation": {
        "id": 4,
        "budgetId": 4,
        "programId": 3,
        "classificationId": 7,
        "objectOfExpenditureId": 3,
        "allocatedAmount": "5000",
        "usedAmount": "0",
        "createdAt": "2026-01-15T09:15:30.131Z",
        "updatedAt": "2026-01-15T09:15:30.131Z",
        "deletedAt": null
      },
      "createdBy": {
        "id": 6,
        "email": "admin@system.local",
        "fullName": "System Super Admin",
        "status": "ACTIVE"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1
  }
}

❌ Error Response
Invalid query / validation error (400)
{
  "success": false,
  "message": "Invalid request status"
}

Server error (500)
{
  "success": false,
  "message": "Internal server error"
}

🧠 Notes (Important)

Soft-deleted requests (deletedAt != null) are never returned

Only DRAFT requests can be:

updated

deleted

submitted

Pagination is always included

Search applies to title only

Status filtering matches exact workflow logic