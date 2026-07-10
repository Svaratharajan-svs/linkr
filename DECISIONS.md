# Linkr Engineering Decisions

## 1. Short Code Generation

**Decision**

Generate random 6-character codes.

**Reason**
- Simple
- Fast
- Enough namespace for MVP

**Tradeoff**

At very large scale, collision probability increases.

**Future**

Use distributed ID generation or Base62 Snowflake IDs.

---

## 2. Async Click Tracking

**Decision**

Redirect does not wait for the database insert.

**Flow**

```
User
 |
Redirect
 |
Goroutine
 |
Channel
 |
Worker
 |
PostgreSQL
```

**Reason**

Redirect is the hot path. The user should receive the redirect immediately.

**Tradeoff**

A process crash may lose clicks held in memory.

**Future**

Use Kafka/SQS for durable events.

---

## 3. PostgreSQL Design

**Indexes**

| Table   | Index                     |
|---------|---------------------------|
| links   | `code`                    |
| clicks  | `link_id`, `clicked_at`   |

**Reason**

Redirect lookup is frequent. Statistics require date filtering.

**Future Scaling**
- Read replicas
- Partition clicks table
- Cache popular links

---

## 4. Authentication

**Decision**

AWS Cognito JWT verification.

**Reason**

Avoid implementing password management. Cognito provides:
- Token issuing
- User management
- Security features

---

## 5. Scaling Strategy

**Current**
- Stateless Go API
- Database connection pool
- Async writes
- Indexed queries

**Would Scale**

| Layer    | Approach                                   |
|----------|---------------------------------------------|
| Frontend | Multiple Next.js instances behind a CDN      |
| Backend  | Multiple Go containers behind a load balancer |
| Database | Read replicas + partitioning                 |
| Cache    | Redis for hot redirect lookup                |
| Queue    | Kafka/SQS for click events                   |

---
