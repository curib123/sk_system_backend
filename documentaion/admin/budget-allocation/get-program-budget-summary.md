Get Program Budget Summary

Retrieve program budgets grouped by classification and object of expenditure.

Endpoint

GET /api/budget-allocations/reports/program-summary

Success Response (200)
{
  "success": true,
  "data": [
    {
      "programId": 1,
      "programCode": "PRG-001",
      "programName": "Education Program",
      "totalAllocated": 2000000,
      "totalUsed": 800000,
      "classifications": [
        {
          "classificationId": 3,
          "classificationCode": "OOE",
          "classificationName": "Operating Expenses",
          "totalAllocated": 1200000,
          "totalUsed": 500000,
          "objects": [
            {
              "objectId": 4,
              "objectCode": "SUP",
              "objectName": "Supplies",
              "allocatedAmount": 600000,
              "usedAmount": 250000
            }
          ]
        }
      ]
    }
  ]
}

Error Response (500)
{
  "success": false,
  "message": "Internal server error"
}
