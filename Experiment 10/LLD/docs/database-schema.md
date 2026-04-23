# Database Schema Design

## Storage strategy

CampusConnect+ intentionally uses polyglot persistence:

- PostgreSQL for structured identity, user graph, roles, and experiment assignments
- MongoDB for chat history, anonymous posts, moderation queue snapshots, and notifications
- Redis for cache, geospatial indexes, rate-limit counters, and presence state

## PostgreSQL schema

### `users`

| column | type | notes |
| --- | --- | --- |
| `id` | `uuid` | primary key |
| `email` | `citext` | unique |
| `name` | `text` | display name |
| `handle` | `citext` | unique |
| `role` | `enum(user, moderator, admin)` | RBAC |
| `campus` | `text` | partition/filter dimension |
| `department` | `text` | collaborative feature |
| `bio` | `text` | profile content |
| `reputation` | `int` | trust score |
| `created_at` | `timestamptz` | audit |

Indexes:
- unique index on `email`
- unique index on `handle`
- composite index on `(campus, department)`

### `user_interests`

| column | type | notes |
| --- | --- | --- |
| `user_id` | `uuid` | FK to users |
| `interest` | `text` | normalized tag |

Indexes:
- composite index on `(interest, user_id)`

### `user_skills`

| column | type | notes |
| --- | --- | --- |
| `user_id` | `uuid` | FK to users |
| `skill` | `text` | normalized tag |

### `identity_verifications`

| column | type | notes |
| --- | --- | --- |
| `user_id` | `uuid` | FK |
| `wallet_address` | `text` | optional |
| `identity_hash` | `text` | blockchain anchor |
| `network` | `text` | e.g. sepolia |
| `verified_at` | `timestamptz` | audit |

### `feature_flags`

| column | type | notes |
| --- | --- | --- |
| `key` | `text` | unique flag key |
| `enabled` | `boolean` | default toggle |
| `rollout_percentage` | `int` | rollout control |
| `owner` | `text` | owning team |

### `experiment_assignments`

| column | type | notes |
| --- | --- | --- |
| `experiment_key` | `text` | experiment id |
| `user_id` | `uuid` | subject |
| `variant` | `text` | active treatment |
| `assigned_at` | `timestamptz` | audit |

## MongoDB collections

### `messages`

```json
{
  "_id": "msg-123",
  "conversationId": "conv-9",
  "senderId": "user-1",
  "recipientIds": ["user-2", "user-3"],
  "body": "Offline sync is ready",
  "messageType": "text",
  "attachments": [],
  "deliveryState": "delivered",
  "readBy": ["user-2"],
  "deliveredTo": ["user-2", "user-3"],
  "sentAt": "2026-04-23T10:00:00.000Z"
}
```

Indexes:
- `{ conversationId: 1, sentAt: -1 }`
- `{ recipientIds: 1, deliveryState: 1 }`

### `posts`

```json
{
  "_id": "post-77",
  "authorHash": "anon-a11c",
  "campus": "North Campus",
  "category": "warning",
  "body": "Anonymous safety note...",
  "tags": ["safety", "security"],
  "moderationScore": 0.71,
  "status": "queued",
  "reports": 2,
  "createdAt": "2026-04-23T10:15:00.000Z"
}
```

Indexes:
- `{ campus: 1, createdAt: -1 }`
- `{ status: 1, moderationScore: -1 }`
- text index on `body` and `tags`

### `notifications`

Indexes:
- `{ userId: 1, createdAt: -1 }`
- `{ userId: 1, read: 1 }`

## Redis usage

### Geo indexes

- key pattern: `geo:campus:{campus}`
- members: `userId`
- score: latitude/longitude through `GEOADD`

### Cache keys

- `dashboard:{userId}`
- `matches:{userId}:{geohash}`
- `feed:{campus}`
- `flags:{userId}`

### Presence keys

- `presence:{userId}` with TTL

## Sharding strategy

### PostgreSQL

- shard or partition conceptually by `campus`
- read replicas for profile and recommendation-heavy reads

### MongoDB

- shard `messages` by `conversationId`
- shard `posts` by `(campus, createdAt)`

### Redis

- use clustered Redis with key hashing
- keep hot keys small and predictable

## SQL vs NoSQL trade-off

- SQL is better for identity, permissions, feature flags, and relationships
- NoSQL is better for append-heavy chat and flexible anonymous post structures
- Using both keeps transactional correctness where needed and write scalability where needed
