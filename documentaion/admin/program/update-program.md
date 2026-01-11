UPDATE PROGRAM

Method
PUT

Endpoint
/api/programs/:id

Content-Type
multipart/form-data

Sample Request Body (form-data)
Key	Type	Required	Description
name	Text	❌	Program name
description	Text	❌	Program description
committeeInCharge	Text	❌	Responsible committee
beneficiaries	Text	❌	Target beneficiaries
startDate	Text	❌	Start date (YYYY-MM-DD)
endDate	Text	❌	End date (YYYY-MM-DD)
isActive	Text	❌	true / false
image	File	❌	New program image (replaces old image)

📌 IMPORTANT

All fields are optional

If image is not provided, the existing image remains

Field name for image upload must be image

Sample Success Response (200)
{
  "success": true,
  "data": {
    "id": 1,
    "code": "PRG-001",
    "name": "Updated Scholarship Program",
    "description": "Updated description",
    "imageUrl": "/uploads/programs/1704959999999.png",
    "committeeInCharge": "Education Committee",
    "beneficiaries": "College Students",
    "startDate": "2026-01-01T00:00:00.000Z",
    "endDate": "2026-12-31T00:00:00.000Z",
    "isActive": true,
    "updatedAt": "2026-01-11T10:15:00.000Z"
  }
}

Possible Error Responses

400 – Validation Error

{
  "success": false,
  "message": "Program not found"
}


400 – Invalid File

{
  "success": false,
  "message": "Only image files are allowed"
}


401 – Unauthorized

{
  "success": false,
  "message": "Unauthorized"
}