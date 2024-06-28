# Gamba Blinks

## Step-by-Step Interaction Flow

### 1. Initial GET Request

**Request:**

GET /action-endpoint
Host: example.com
Accept: application/json
Accept-Encoding: gzip, deflate
Origin: http://example.com

**Response Headers:**

HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Content-Encoding: gzip

**Response Body:**

```
{
    "icon": "https://example.com/icon.png",
    "title": "Action Title",
    "description": "Action Description",
    "label": "Action Button Text",
    "links": {
        "actions": [
            {
                "label": "Action 1",
                "href": "/api/action1"
            },
            {
                "label": "Action 2",
                "href": "/api/action2"
            },
            {
                "label": "Action with Input",
                "href": "/api/action-with-input/{parameter}",
                "parameters": [
                    {
                        "name": "parameter",
                        "label": "Input Placeholder"
                    }
                ]
            }
        ]
    }
}
```

### 2. POST Request with User Input

**Request:**

POST /api/action-with-input
Host: example.com
Content-Type: application/json
Accept: application/json
Accept-Encoding: gzip, deflate
Origin: http://example.com

**Request Body:**

```
{
    "account": "userPublicKey",
    "parameter": "userInputValue"
}
```

**Response Headers:**

HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Content-Encoding: gzip

**Response Body:**

```
{
    "transaction": "base64EncodedTransaction",
    "message": "Action completed successfully!"
}
```

### 3. CORS Preflight Request (OPTIONS)

**Request:**

OPTIONS /api/action-with-input
Host: example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type
Origin: http://example.com

**Response Headers:**

HTTP/1.1 204 No Content
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization

### Example Error Handling

**Error Response Headers:**

HTTP/1.1 400 Bad Request
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Content-Encoding: gzip

**Error Response Body:**

```
{
    "error": "Invalid request parameters"
}
```

### Security Considerations

1. **Registry Check:** Ensure actions are registered in a public registry to be considered trusted.
2. **Validation:** Implement validation logic to check if actions can be executed (e.g., checking if an auction has ended).
3. **CORS Configuration:** Properly configure CORS headers to allow cross-origin requests from trusted domains.

