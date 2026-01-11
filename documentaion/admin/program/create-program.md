CREATE PROGRAM

Method
POST

Endpoint
/api/programs

Sample Request Body

{
  "code": "PRG-001",
  "name": "Scholarship Program",
  "description": "Student financial assistance program",
  "imageUrl": "https://example.com/program.png",
  "committeeInCharge": "Education Committee",
  "beneficiaries": "College Students",
  "startDate": "2026-01-01",
  "endDate": "2026-12-31",
  "isActive": true
}


Sample Success Response (201)

{
  "success": true,
  "data": {
    "id": 1,
    "code": "PRG-001",
    "name": "Scholarship Program",
    "description": "Student financial assistance program",
    "imageUrl": "https://example.com/program.png",
    "committeeInCharge": "Education Committee",
    "beneficiaries": "College Students",
    "startDate": "2026-01-01T00:00:00.000Z",
    "endDate": "2026-12-31T00:00:00.000Z",
    "isActive": true,
    "createdAt": "2026-01-11T09:00:00.000Z"
  }
}