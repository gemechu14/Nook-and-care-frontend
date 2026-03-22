# Listing Features Batch Operations API

Complete API documentation for batch create and delete operations on listing features (amenities, activities, languages, certifications, dining options, safety features, insurance options, house rules, equipment, and services).

**Base Path:** `/api/v1`

---

## Overview

These endpoints allow providers to manage multiple listing feature associations in a single request, significantly improving performance and user experience when managing listings with many features.

### Key Features

- **Batch Operations**: Create or delete multiple associations in one request
- **Transaction Safety**: All-or-nothing behavior - if any item fails, the entire batch is rolled back
- **Validation**: Comprehensive validation before any database operations
- **Authorization**: Only listing owners (providers) or admins can manage features
- **Duplicate Prevention**: Automatically prevents duplicate associations

---

## Authentication

All endpoints require Bearer token authentication:

```
Authorization: Bearer <your_access_token>
```

**Required Role:** `PROVIDER` (must own the listing) or `ADMIN`

---

## Common Request Format

All batch endpoints follow the same pattern:

### Batch Create
```json
{
  "items": [
    {
      "listing_id": "uuid",
      "{feature}_id": "uuid",
      // ... additional fields for specific feature types
    }
  ]
}
```

### Batch Delete
```json
{
  "items": [
    {
      "listing_id": "uuid",
      "{feature}_id": "uuid"
    }
  ]
}
```

### Validation Rules

1. **Same Listing**: All items in a batch must reference the same `listing_id`
2. **Valid IDs**: All feature IDs must exist in the catalog
3. **No Duplicates**: Cannot create associations that already exist
4. **Ownership**: User must own the listing (or be admin)

---

## Common Response Format

All endpoints return an array of created/deleted associations:

```json
[
  {
    "id": "uuid",
    "listing_id": "uuid",
    "{feature}_id": "uuid",
    "created_at": "2024-01-01T00:00:00Z"
    // ... additional fields for specific feature types
  }
]
```

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "All items must reference the same listing"
}
```

```json
{
  "detail": "Some amenities already associated: {amenity_ids}"
}
```

### 401 Unauthorized
```json
{
  "detail": "Not authenticated"
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to manage this listing"
}
```

### 404 Not Found
```json
{
  "detail": "Listing not found"
}
```

```json
{
  "detail": "Amenity {amenity_id} not found"
}
```

---

## 1. Listing Amenities

### Batch Create Amenities

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
```json
[
  {
    "id": "423e4567-e89b-12d3-a456-426614174003",
    "listing_id": "123e4567-e89b-12d3-a456-426614174000",
    "amenity_id": "223e4567-e89b-12d3-a456-426614174001",
    "created_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "523e4567-e89b-12d3-a456-426614174004",
    "listing_id": "123e4567-e89b-12d3-a456-426614174000",
    "amenity_id": "323e4567-e89b-12d3-a456-426614174002",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Batch Delete Amenities

**Endpoint:** `DELETE /api/v1/listing-amenities/batch`

**Request Body:**
```json
{
  "items": [
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "amenity_id": "223e4567-e89b-12d3-a456-426614174001"
    }
  ]
}
```

**Response:** `200 OK`
```json
[
  {
    "id": "423e4567-e89b-12d3-a456-426614174003",
    "listing_id": "123e4567-e89b-12d3-a456-426614174000",
    "amenity_id": "223e4567-e89b-12d3-a456-426614174001",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

---

## 2. Listing Activities

### Batch Create Activities

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
```json
[
  {
    "id": "423e4567-e89b-12d3-a456-426614174003",
    "listing_id": "123e4567-e89b-12d3-a456-426614174000",
    "activity_id": "223e4567-e89b-12d3-a456-426614174001",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Batch Delete Activities

**Endpoint:** `DELETE /api/v1/listing-activities/batch`

**Request Body:** Same as create

**Response:** `200 OK` - Array of deleted associations

---

## 3. Listing Languages

### Batch Create Languages

**Endpoint:** `POST /api/v1/listing-languages/batch`

**Request Body:**
```json
{
  "items": [
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "language_id": "223e4567-e89b-12d3-a456-426614174001"
    }
  ]
}
```

### Batch Delete Languages

**Endpoint:** `DELETE /api/v1/listing-languages/batch`

**Request Body:** Same as create

**Response:** `200 OK` - Array of deleted associations

---

## 4. Listing Certifications

### Batch Create Certifications

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
```json
[
  {
    "id": "423e4567-e89b-12d3-a456-426614174003",
    "listing_id": "123e4567-e89b-12d3-a456-426614174000",
    "certification_id": "223e4567-e89b-12d3-a456-426614174001",
    "license_number": "LIC-12345",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Batch Delete Certifications

**Endpoint:** `DELETE /api/v1/listing-certifications/batch`

**Request Body:**
```json
{
  "items": [
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "certification_id": "223e4567-e89b-12d3-a456-426614174001"
    }
  ]
}
```

**Response:** `200 OK` - Array of deleted associations

---

## 5. Listing Dining Options

### Batch Create Dining Options

**Endpoint:** `POST /api/v1/listing-dining-options/batch`

**Request Body:**
```json
{
  "items": [
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "dining_option_id": "223e4567-e89b-12d3-a456-426614174001"
    }
  ]
}
```

### Batch Delete Dining Options

**Endpoint:** `DELETE /api/v1/listing-dining-options/batch`

**Request Body:** Same as create

**Response:** `200 OK` - Array of deleted associations

---

## 6. Listing Safety Features

### Batch Create Safety Features

**Endpoint:** `POST /api/v1/listing-safety-features/batch`

**Request Body:**
```json
{
  "items": [
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "safety_feature_id": "223e4567-e89b-12d3-a456-426614174001"
    }
  ]
}
```

### Batch Delete Safety Features

**Endpoint:** `DELETE /api/v1/listing-safety-features/batch`

**Request Body:** Same as create

**Response:** `200 OK` - Array of deleted associations

---

## 7. Listing Insurance Options

### Batch Create Insurance Options

**Endpoint:** `POST /api/v1/listing-insurance-options/batch`

**Request Body:**
```json
{
  "items": [
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "insurance_option_id": "223e4567-e89b-12d3-a456-426614174001"
    }
  ]
}
```

### Batch Delete Insurance Options

**Endpoint:** `DELETE /api/v1/listing-insurance-options/batch`

**Request Body:** Same as create

**Response:** `200 OK` - Array of deleted associations

---

## 8. Listing House Rules

### Batch Create House Rules

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

**Note:** `display_order` is optional. If not provided, it will be auto-incremented based on the item's position in the array (0, 1, 2, ...).

**Response:** `201 Created`
```json
[
  {
    "id": "423e4567-e89b-12d3-a456-426614174003",
    "listing_id": "123e4567-e89b-12d3-a456-426614174000",
    "house_rule_id": "223e4567-e89b-12d3-a456-426614174001",
    "display_order": 1,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Batch Delete House Rules

**Endpoint:** `DELETE /api/v1/listing-house-rules/batch`

**Request Body:**
```json
{
  "items": [
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "house_rule_id": "223e4567-e89b-12d3-a456-426614174001"
    }
  ]
}
```

**Response:** `200 OK` - Array of deleted associations

---

## 9. Listing Equipment

### Batch Create Equipment

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

**Note:** `quantity` defaults to `1` if not provided.

**Response:** `201 Created`
```json
[
  {
    "id": "423e4567-e89b-12d3-a456-426614174003",
    "listing_id": "123e4567-e89b-12d3-a456-426614174000",
    "equipment_id": "223e4567-e89b-12d3-a456-426614174001",
    "quantity": 5,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Batch Delete Equipment

**Endpoint:** `DELETE /api/v1/listing-equipment/batch`

**Request Body:**
```json
{
  "items": [
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "equipment_id": "223e4567-e89b-12d3-a456-426614174001"
    }
  ]
}
```

**Response:** `200 OK` - Array of deleted associations

---

## 10. Listing Services (Treatment Services)

### Batch Create Services

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
- `is_included` defaults to `false` if not provided

**Response:** `201 Created`
```json
[
  {
    "id": "423e4567-e89b-12d3-a456-426614174003",
    "listing_id": "123e4567-e89b-12d3-a456-426614174000",
    "treatment_service_id": "223e4567-e89b-12d3-a456-426614174001",
    "price": 50.00,
    "is_included": false,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Batch Delete Services

**Endpoint:** `DELETE /api/v1/listing-services/batch`

**Request Body:**
```json
{
  "items": [
    {
      "listing_id": "123e4567-e89b-12d3-a456-426614174000",
      "treatment_service_id": "223e4567-e89b-12d3-a456-426614174001"
    }
  ]
}
```

**Response:** `200 OK` - Array of deleted associations

---

## Endpoint Summary

| Feature Type | Create Endpoint | Delete Endpoint |
|-------------|----------------|-----------------|
| Amenities | `POST /listing-amenities/batch` | `DELETE /listing-amenities/batch` |
| Activities | `POST /listing-activities/batch` | `DELETE /listing-activities/batch` |
| Languages | `POST /listing-languages/batch` | `DELETE /listing-languages/batch` |
| Certifications | `POST /listing-certifications/batch` | `DELETE /listing-certifications/batch` |
| Dining Options | `POST /listing-dining-options/batch` | `DELETE /listing-dining-options/batch` |
| Safety Features | `POST /listing-safety-features/batch` | `DELETE /listing-safety-features/batch` |
| Insurance Options | `POST /listing-insurance-options/batch` | `DELETE /listing-insurance-options/batch` |
| House Rules | `POST /listing-house-rules/batch` | `DELETE /listing-house-rules/batch` |
| Equipment | `POST /listing-equipment/batch` | `DELETE /listing-equipment/batch` |
| Services | `POST /listing-services/batch` | `DELETE /listing-services/batch` |

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

**Last Updated:** 2024
**Version:** 1.0
