# API Documentation

CampusConnect+ exposes a gateway-first REST API. Internal services can also be called directly in development, but the gateway is the public contract.

## Gateway endpoints

### `POST /api/auth/login`

Request:

```json
{
  "email": "aarav@college.edu",
  "password": "demo-password"
}
```

Response:

```json
{
  "accessToken": "jwt-like-token",
  "refreshToken": "refresh-token",
  "userId": "user-1",
  "role": "user",
  "expiresInSeconds": 3600
}
```

### `GET /api/dashboard/:userId`

Returns an aggregated payload with:

- profile
- matches
- recommendations
- posts
- conversations
- notifications
- moderation queue
- feature flags
- experiments
- analytics
- service health

### `GET /api/search?q=ai`

Searches across:

- user directory
- anonymous posts

### `GET /api/architecture`

Returns a lightweight system summary for the frontend architecture panel.

### `POST /api/posts/anonymous`

Request:

```json
{
  "body": "Looking for teammates for a safety app",
  "campus": "North Campus",
  "category": "opportunity",
  "tags": ["startups", "security"]
}
```

### `POST /api/chat/messages`

Request:

```json
{
  "conversationId": "conv-2",
  "senderId": "user-1",
  "body": "Uploading the architecture deck",
  "recipientIds": ["user-3", "user-4"],
  "attachments": [
    {
      "id": "att-11",
      "kind": "document",
      "url": "https://cdn.example.com/deck.pdf",
      "fileName": "deck.pdf"
    }
  ]
}
```

## Internal service examples

### Auth service

- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me/:userId`
- `GET /auth/identity/:userId`

### User service

- `GET /profiles`
- `GET /profiles/:id`
- `GET /profiles/search?q=ml`
- `PUT /profiles/:id/location`
- `GET /profiles/:id/feature-flags`

### Matching service

- `GET /matches/:userId`
- `GET /matches/:userId/live`
- `POST /matches/recompute`

### Chat service

- `GET /conversations/:userId`
- `GET /conversations/:conversationId/messages`
- `GET /sync/:userId`
- `POST /messages`
- `PATCH /messages/:id/status`

### Moderation service

- `GET /posts`
- `GET /posts/search?q=safety`
- `POST /posts/anonymous`
- `POST /reports`
- `GET /admin/queue`
- `GET /admin/summary`

### Recommendation service

- `GET /recommendations/:userId`
- `GET /recommendations/:userId/explain`

### Notification service

- `GET /notifications/:userId`
- `POST /notifications`
- `PATCH /notifications/:id/read`

## API style decisions

- REST was preferred over GraphQL to keep service boundaries and gateway aggregation easy to explain
- gateway aggregation gives the frontend a simplified contract without exposing all internal topology
- WebSockets are isolated to chat/presence because those interactions benefit most from push transport
