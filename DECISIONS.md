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

**Tradeoff**
Use Amazon Cognito instead of a custom authentication implementation.

**Reason**
Amazon Cognito provides a highly scalable and secure authentication service with built-in support for user management, JWT token issuance, MFA, password policies, and social identity providers. Although it incurs additional cost compared to a self-managed solution, it significantly reduces development effort, maintenance, and security risks, making it a better choice for production-grade applications.
---

## 5. Future Scaling Strategy

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
