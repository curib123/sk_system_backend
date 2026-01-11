GET ALL PROGRAMS

Method
GET

Endpoint
/api/programs

Query Parameters (Optional)
Parameter	Type	Description	Example
q	string	Search keyword (code, name, description, committee, beneficiaries)	scholar
isActive	boolean	Filter by active status	true
startDateFrom	date	Filter programs starting from date (YYYY-MM-DD)	2026-01-01
startDateTo	date	Filter programs up to date (YYYY-MM-DD)	2026-12-31
sortBy	string	Sort field	createdAt, name, code
sortOrder	string	Sort direction	asc / desc
page	number	Page number (default: 1)	1
limit	number	Items per page (default: 10)	10
Sample Requests

Basic

GET /api/programs


Search

GET /api/programs?q=scholar


Filter Active Programs

GET /api/programs?isActive=true


Sort by Name

GET /api/programs?sortBy=name&sortOrder=asc


Paginated

GET /api/programs?page=2&limit=5


Combined

GET /api/programs?q=education&isActive=true&page=1&limit=10&sortBy=createdAt&sortOrder=desc

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
  ],
  "meta": {
    "total": 12,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}

Possible Error Responses

401 – Unauthorized

{
  "success": false,
  "message": "Unauthorized"
}


500 – Server Error

{
  "success": false,
  "message": "Internal server error"
}