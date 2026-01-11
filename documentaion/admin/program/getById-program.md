GET PROGRAM BY ID

Method
GET

Endpoint
/api/programs/:id

Sample Success Response (200)

{
  "success": true,
  "data": {
    "id": 1,
    "code": "PRG-001",
    "name": "Scholarship Program",
    "description": "Student financial assistance program",
    "committeeInCharge": "Education Committee",
    "beneficiaries": "College Students",
    "startDate": "2026-01-01T00:00:00.000Z",
    "endDate": "2026-12-31T00:00:00.000Z",
    "isActive": true
  }
}