# Listing Images API

Image upload and management endpoints for listing images.

**Base Path:** `/api/v1/listing-images`

## Endpoints

### List All Images

Get all listing images.

**Endpoint:** `GET /api/v1/listing-images`

**Authentication:** Not required (public endpoint)

**Response:** `200 OK`

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "listing_id": "223e4567-e89b-12d3-a456-426614174000",
    "image_url": "https://example.com/image.jpg",
    "filename": "facility-photo.jpg",
    "content_type": "image/jpeg",
    "file_size": 245678,
    "display_order": 0,
    "is_primary": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

---

### Get Images by Listing

Get all images for a specific listing.

**Endpoint:** `GET /api/v1/listing-images/listing/{listing_id}`

**Authentication:** Not required (public endpoint)

**Path Parameters:**
- `listing_id` (UUID, required) - Listing ID

**Example Request:**
```
GET /api/v1/listing-images/listing/223e4567-e89b-12d3-a456-426614174000
```

**Response:** `200 OK`

Same format as List All Images response.

---

### Get Image by ID

Get image metadata by ID.

**Endpoint:** `GET /api/v1/listing-images/{image_id}`

**Authentication:** Not required (public endpoint)

**Path Parameters:**
- `image_id` (UUID, required) - Image ID

**Example Request:**
```
GET /api/v1/listing-images/123e4567-e89b-12d3-a456-426614174000
```

**Response:** `200 OK`

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "listing_id": "223e4567-e89b-12d3-a456-426614174000",
  "image_url": "https://example.com/image.jpg",
  "filename": "facility-photo.jpg",
  "content_type": "image/jpeg",
  "file_size": 245678,
  "display_order": 0,
  "is_primary": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

**Error Responses:**
- `404 Not Found` - Image not found

---

### Download Image

Download image binary data.

**Endpoint:** `GET /api/v1/listing-images/{image_id}/download`

**Authentication:** Not required (public endpoint)

**Path Parameters:**
- `image_id` (UUID, required) - Image ID

**Example Request:**
```
GET /api/v1/listing-images/123e4567-e89b-12d3-a456-426614174000/download
```

**Response:** `200 OK`

Binary image data with appropriate `Content-Type` header.

**Error Responses:**
- `404 Not Found` - Image not found or image data not available

---

### Upload Image (File Upload)

Upload an image file and store it in the database.

**Endpoint:** `POST /api/v1/listing-images/upload`

**Authentication:** Required (Bearer token, Provider role)

**Request:** `multipart/form-data`

**Form Fields:**
- `listing_id` (UUID, required) - Listing ID
- `file` (file, required) - Image file
- `display_order` (integer, optional, default: 0) - Display order
- `is_primary` (boolean, optional, default: false) - Whether this is the primary image

**Example Request:**
```
POST /api/v1/listing-images/upload
Content-Type: multipart/form-data

listing_id: 223e4567-e89b-12d3-a456-426614174000
file: [binary image data]
display_order: 0
is_primary: true
```

**Response:** `201 Created`

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "listing_id": "223e4567-e89b-12d3-a456-426614174000",
  "image_url": null,
  "filename": "facility-photo.jpg",
  "content_type": "image/jpeg",
  "file_size": 245678,
  "display_order": 0,
  "is_primary": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid file or request data
- `403 Forbidden` - Insufficient permissions

---

### Create Image (Base64 or URL)

Create an image record using base64 data or URL.

**Endpoint:** `POST /api/v1/listing-images`

**Authentication:** Required (Bearer token, Provider role)

**Request Body:**
```json
{
  "listing_id": "223e4567-e89b-12d3-a456-426614174000",
  "image_url": "https://example.com/image.jpg",
  "display_order": 0,
  "is_primary": true
}
```

**OR with base64:**

```json
{
  "listing_id": "223e4567-e89b-12d3-a456-426614174000",
  "image_data_base64": "iVBORw0KGgoAAAANSUhEUgAA...",
  "filename": "facility-photo.jpg",
  "content_type": "image/jpeg",
  "display_order": 0,
  "is_primary": true
}
```

**Request Fields:**
- `listing_id` (UUID, required) - Listing ID
- `image_url` (string, optional) - Image URL (if using URL)
- `image_data_base64` (string, optional) - Base64-encoded image data (if using base64)
- `filename` (string, optional) - Filename
- `content_type` (string, optional) - MIME type (e.g., "image/jpeg")
- `display_order` (integer, optional, default: 0) - Display order
- `is_primary` (boolean, optional, default: false) - Whether this is the primary image

**Response:** `201 Created`

Same format as Get Image by ID response.

**Error Responses:**
- `400 Bad Request` - Invalid request data
- `403 Forbidden` - Insufficient permissions

---

### Update Image

Update image metadata.

**Endpoint:** `PUT /api/v1/listing-images/{image_id}`

**Authentication:** Required (Bearer token, Provider role)

**Path Parameters:**
- `image_id` (UUID, required) - Image ID

**Request Body:**
```json
{
  "display_order": 1,
  "is_primary": false
}
```

**Request Fields:** (All optional)
- `image_url` (string, optional)
- `image_data_base64` (string, optional)
- `filename` (string, optional)
- `content_type` (string, optional)
- `display_order` (integer, optional)
- `is_primary` (boolean, optional)

**Response:** `200 OK`

Same format as Get Image by ID response.

**Error Responses:**
- `404 Not Found` - Image not found
- `400 Bad Request` - Invalid request data
- `403 Forbidden` - Insufficient permissions

---

### Delete Image

Delete an image.

**Endpoint:** `DELETE /api/v1/listing-images/{image_id}`

**Authentication:** Required (Bearer token, Provider role)

**Path Parameters:**
- `image_id` (UUID, required) - Image ID

**Example Request:**
```
DELETE /api/v1/listing-images/123e4567-e89b-12d3-a456-426614174000
```

**Response:** `204 No Content`

**Error Responses:**
- `404 Not Found` - Image not found
- `403 Forbidden` - Insufficient permissions

---

## Frontend Integration Example

```typescript
const BASE_URL = 'http://localhost:8000/api/v1';

// Upload image file
async function uploadImageFile(
  listingId: string,
  file: File,
  displayOrder: number = 0,
  isPrimary: boolean = false
) {
  const accessToken = localStorage.getItem('access_token');
  
  const formData = new FormData();
  formData.append('listing_id', listingId);
  formData.append('file', file);
  formData.append('display_order', displayOrder.toString());
  formData.append('is_primary', isPrimary.toString());
  
  const response = await fetch(`${BASE_URL}/listing-images/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`
      // Don't set Content-Type header, browser will set it with boundary
    },
    body: formData
  });
  
  if (!response.ok) {
    throw new Error('Failed to upload image');
  }
  
  return response.json();
}

// Upload image as base64
async function uploadImageBase64(
  listingId: string,
  base64Data: string,
  filename: string,
  contentType: string,
  displayOrder: number = 0,
  isPrimary: boolean = false
) {
  const accessToken = localStorage.getItem('access_token');
  
  const response = await fetch(`${BASE_URL}/listing-images`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      listing_id: listingId,
      image_data_base64: base64Data,
      filename,
      content_type: contentType,
      display_order: displayOrder,
      is_primary: isPrimary
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to upload image');
  }
  
  return response.json();
}

// Get images for a listing
async function getListingImages(listingId: string) {
  const response = await fetch(`${BASE_URL}/listing-images/listing/${listingId}`);
  return response.json();
}

// Download image
function getImageUrl(imageId: string): string {
  return `${BASE_URL}/listing-images/${imageId}/download`;
}

// Usage example: Convert file to base64 and upload
async function uploadFileAsBase64(listingId: string, file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      // Remove data URL prefix if present
      const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
      
      try {
        const result = await uploadImageBase64(
          listingId,
          base64Data,
          file.name,
          file.type
        );
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
```

