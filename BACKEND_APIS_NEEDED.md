# Backend APIs Required for Batch Feature Management

This document lists all the backend API endpoints that need to be implemented to support the multi-select batch feature management functionality in the provider listing management page.

## Overview

The frontend now supports selecting multiple items (amenities, activities, languages, etc.) at once and saving them in a single batch operation. This requires new batch endpoints for each feature type.

---

## Batch Add Endpoints

All batch endpoints follow the same pattern:
- **Method:** `POST`
- **Path:** `/{resource}/batch`
- **Authentication:** Required (Bearer token, Provider role)
- **Request Body:** JSON object with `items` array

### Request Format

```json
{
  "items": [
    {
      "listing_id": "uuid",
      "{feature}_id": "uuid"
    },
    {
      "listing_id": "uuid",
      "{feature}_id": "uuid"
    }
  ]
}
```

### Response Format

```json
[
  {
    "id": "uuid",
    "listing_id": "uuid",
    "{feature}_id": "uuid",
    "created_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "uuid",
    "listing_id": "uuid",
    "{feature}_id": "uuid",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

---

## 1. Listing Amenities Batch Add

**Endpoint:** `POST /api/v1/listing-amenities/batch`

**Request Body:**
```json
{
  "items": [
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "amenity_id": "223e4567-e89b-12d3-a456-426614174001"
    },
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "amenity_id": "323e4567-e89b-12d3-a456-426614174002"
    }
  ]
}
```

**Response:** `201 Created`
- Returns array of `ListingAmenityRecord` objects

**Error Responses:**
- `400 Bad Request` - Invalid request data or duplicate associations
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Listing or amenity not found

---

## 2. Listing Activities Batch Add

**Endpoint:** `POST /api/v1/listing-activities/batch`

**Request Body:**
```json
{
  "items": [
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "activity_id": "223e4567-e89b-12d3-a456-426614174001"
    },
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "activity_id": "323e4567-e89b-12d3-a456-426614174002"
    }
  ]
}
```

**Response:** `201 Created`
- Returns array of `ListingActivityRecord` objects

---

## 3. Listing Languages Batch Add

**Endpoint:** `POST /api/v1/listing-languages/batch`

**Request Body:**
```json
{
  "items": [
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "language_id": "223e4567-e89b-12d3-a456-426614174001"
    },
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "language_id": "323e4567-e89b-12d3-a456-426614174002"
    }
  ]
}
```

**Response:** `201 Created`
- Returns array of `ListingLanguageRecord` objects

---

## 4. Listing Certifications Batch Add

**Endpoint:** `POST /api/v1/listing-certifications/batch`

**Request Body:**
```json
{
  "items": [
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "certification_id": "223e4567-e89b-12d3-a456-426614174001",
      "license_number": "LIC-12345"
    },
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "certification_id": "323e4567-e89b-12d3-a456-426614174002",
      "license_number": null
    }
  ]
}
```

**Note:** `license_number` is optional and can be `null`.

**Response:** `201 Created`
- Returns array of `ListingCertificationRecord` objects

---

## 5. Listing Dining Options Batch Add

**Endpoint:** `POST /api/v1/listing-dining-options/batch`

**Request Body:**
```json
{
  "items": [
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "dining_option_id": "223e4567-e89b-12d3-a456-426614174001"
    },
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "dining_option_id": "323e4567-e89b-12d3-a456-426614174002"
    }
  ]
}
```

**Response:** `201 Created`
- Returns array of `ListingDiningOptionRecord` objects

---

## 6. Listing Safety Features Batch Add

**Endpoint:** `POST /api/v1/listing-safety-features/batch`

**Request Body:**
```json
{
  "items": [
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "safety_feature_id": "223e4567-e89b-12d3-a456-426614174001"
    },
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "safety_feature_id": "323e4567-e89b-12d3-a456-426614174002"
    }
  ]
}
```

**Response:** `201 Created`
- Returns array of `ListingSafetyFeatureRecord` objects

---

## 7. Listing Insurance Options Batch Add

**Endpoint:** `POST /api/v1/listing-insurance-options/batch`

**Request Body:**
```json
{
  "items": [
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "insurance_option_id": "223e4567-e89b-12d3-a456-426614174001"
    },
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "insurance_option_id": "323e4567-e89b-12d3-a456-426614174002"
    }
  ]
}
```

**Response:** `201 Created`
- Returns array of `ListingInsuranceOptionRecord` objects

---

## 8. Listing House Rules Batch Add

**Endpoint:** `POST /api/v1/listing-house-rules/batch`

**Request Body:**
```json
{
  "items": [
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "house_rule_id": "223e4567-e89b-12d3-a456-426614174001",
      "display_order": 1
    },
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "house_rule_id": "323e4567-e89b-12d3-a456-426614174002",
      "display_order": 2
    }
  ]
}
```

**Note:** `display_order` should be auto-incremented if not provided, or use the index in the array.

**Response:** `201 Created`
- Returns array of `ListingHouseRuleRecord` objects

---

## 9. Listing Equipment Batch Add

**Endpoint:** `POST /api/v1/listing-equipment/batch`

**Request Body:**
```json
{
  "items": [
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "equipment_id": "223e4567-e89b-12d3-a456-426614174001",
      "quantity": 5
    },
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "equipment_id": "323e4567-e89b-12d3-a456-426614174002",
      "quantity": 10
    }
  ]
}
```

**Note:** `quantity` should default to `1` if not provided.

**Response:** `201 Created`
- Returns array of `ListingEquipmentRecord` objects

---

## 10. Listing Services (Treatment Services) Batch Add

**Endpoint:** `POST /api/v1/listing-services/batch`

**Request Body:**
```json
{
  "items": [
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "treatment_service_id": "223e4567-e89b-12d3-a456-426614174001",
      "price": 50.00,
      "is_included": false
    },
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "treatment_service_id": "323e4567-e89b-12d3-a456-426614174002",
      "price": null,
      "is_included": true
    }
  ]
}
```

**Note:** 
- `price` is optional and can be `null`
- `is_included` should default to `false` if not provided

**Response:** `201 Created`
- Returns array of `ListingServiceRecord` objects

---

## Implementation Notes

### Validation Requirements

1. **Authorization:**
   - User must be authenticated
   - User must be the owner of the listing (Provider role) OR Admin
   - Verify `listing_id` belongs to the authenticated provider

2. **Data Validation:**
   - All `listing_id` values in the batch must be the same
   - All `{feature}_id` values must exist in the catalog
   - Prevent duplicate associations (same listing + feature combination)
   - Validate required fields per feature type

3. **Transaction Handling:**
   - Use database transactions to ensure all-or-nothing behavior
   - If any item fails validation, rollback the entire batch
   - Return clear error messages indicating which items failed

4. **Performance:**
   - Consider bulk insert operations for better performance
   - Validate all items before inserting any
   - Return created records in the same order as the request

### Error Response Format

```json
{
  "detail": "Validation failed",
  "errors": [
    {
      "item_index": 0,
      "field": "amenity_id",
      "message": "Amenity not found"
    },
    {
      "item_index": 1,
      "field": "listing_id",
      "message": "Duplicate association already exists"
    }
  ]
}
```

### Database Considerations

- Ensure unique constraints on `(listing_id, {feature}_id)` pairs
- Use bulk insert operations where possible
- Consider adding indexes for performance
- Handle race conditions (multiple simultaneous batch requests)

---

## Summary

**Total Endpoints Required:** 10 batch endpoints

1. `POST /api/v1/listing-amenities/batch`
2. `POST /api/v1/listing-activities/batch`
3. `POST /api/v1/listing-languages/batch`
4. `POST /api/v1/listing-certifications/batch`
5. `POST /api/v1/listing-dining-options/batch`
6. `POST /api/v1/listing-safety-features/batch`
7. `POST /api/v1/listing-insurance-options/batch`
8. `POST /api/v1/listing-house-rules/batch`
9. `POST /api/v1/listing-equipment/batch`
10. `POST /api/v1/listing-services/batch`

All endpoints should follow the same pattern and validation rules for consistency.

