# Scaling Strategy

## Horizontal scaling

All Node services are stateless by design, which allows:

- multiple replicas behind a load balancer
- rolling deployments without sticky compute state
- autoscaling based on CPU, memory, or queue lag

## Matching scale plan

- maintain geospatial buckets in Redis for fast nearby lookup
- trigger recomputations asynchronously when route or interests change
- cache top match candidates per user
- invalidate cache on profile or location mutations

## Chat scale plan

- WebSocket fan-out handled through horizontally scaled chat-service pods
- shared state lives in Redis presence and MongoDB durable history
- Kafka decouples message acceptance from downstream notification and analytics consumers

## Feed scale plan

- anonymous feed pages are cached per campus in Redis
- moderation writes invalidate feed cache keys
- search can move to Elasticsearch/OpenSearch when keyword traffic grows

## Recommendation scale plan

- candidate generation can run offline in batches
- online request path only performs lightweight re-ranking
- experiments and feature flags allow gradual rollout of new models

## Fault tolerance and graceful degradation

- if recommendation-service is slow, the gateway falls back to safe default posts
- if matching-service is unavailable, dashboard still renders profile, feed, and chat
- if WebSockets disconnect, UI remains usable through last-known state and sync endpoints

## Monitoring signals

Track at minimum:

- gateway p95 latency
- per-service error rate
- Kafka consumer lag
- Redis hit rate
- moderation queue depth
- socket connection count
- message delivery delay

## Polling vs WebSockets trade-off

- WebSockets are used for chat and presence because latency matters and fan-out is high
- polling remains acceptable for low-frequency admin dashboards and health panels
- mixed strategy reduces infrastructure load while preserving realtime UX where it matters
