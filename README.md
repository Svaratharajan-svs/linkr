# Linkr - URL Shortener with Analytics

## Tech Stack

### Frontend
- Next.js
- TypeScript

### Backend
- Go
- Gin

### Database
- PostgreSQL

### Authentication
- AWS Cognito JWT

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/Svaratharajan-svs/linkr.git
cd linkr
```

### Start the Application

```bash
docker compose up
```

### Access Points

| Service  | URL                   |
|----------|-----------------------|
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:8080 |

## API Reference

### Create Link

`POST /api/links`

**Authorization:** `Bearer JWT`

**Body:**

```json
{
  "original_url": "https://google.com"
}
```

### List Links

`GET /api/links?page=1&limit=10`

### Redirect

`GET /{code}`

### Statistics

`GET /api/links/{code}/stats`

## Testing

### Test Credentials

| Field    | Value    |
|----------|----------|
| Username |          |
| Password |          |

### Backend Tests

**Start Test Environment**

```bash
docker compose up -d postgres-test backend-test
```

**Run Tests**

```bash
docker compose exec backend-test go test ./...
```

**Run with Race Detector**

```bash
docker compose exec backend-test go test -race ./...
```