# API Documentation

This document provides a comprehensive overview of all API endpoints used by the Vestiva Investment Platform frontend application. These endpoints are currently mocked in the frontend but should be implemented in an Express server to provide real functionality.

## Base URL

All API endpoints are relative to the base URL:

```
https://api.vestiva.com
```

## Authentication

Most endpoints require authentication using a JWT token. The token should be included in the `Authorization` header:

```
Authorization: Bearer <token>
```

### Authentication Endpoints

#### Login

```
POST /auth/login
```

Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

**Status Codes:**
- 200: Success
- 401: Invalid credentials

#### Logout

```
POST /auth/logout
```

Invalidates the current JWT token.

**Response:**
```json
{
  "success": true
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized

#### Get Current User

```
GET /auth/me
```

Returns the currently authenticated user.

**Response:**
```json
{
  "id": "1",
  "email": "user@example.com",
  "name": "User Name"
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized

#### Request Password Reset

```
POST /auth/reset-password/request
```

Sends a password reset email to the user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "recaptchaToken": "recaptcha-token"
}
```

**Response:**
```json
{
  "success": true
}
```

**Status Codes:**
- 200: Success
- 400: Invalid request

#### Validate Reset Token

```
GET /auth/reset-password/validate/:token
```

Validates a password reset token.

**Response:**
```json
{
  "valid": true
}
```

**Status Codes:**
- 200: Success

#### Reset Password

```
POST /auth/reset-password/reset
```

Resets a user's password using a valid token.

**Request Body:**
```json
{
  "token": "reset-token",
  "password": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

**Response:**
```json
{
  "success": true
}
```

**Status Codes:**
- 200: Success
- 400: Invalid request
- 401: Invalid token

## Accounts

### Get All Accounts

```
GET /accounts
```

Returns all accounts for the authenticated user.

**Response:**
```json
[
  {
    "id": "U13186484",
    "alias": "Joaco",
    "type": "AUTOMATED_INVESTMENT",
    "value": 14692.92,
    "percentage": 35,
    "funded": true,
    "performance": {
      "total": -115.21,
      "percentage": -0.79,
      "period": "1Y"
    }
  },
  {
    "id": "U10246500",
    "alias": "Market Hub",
    "type": "MARKET_HUB",
    "value": 5297.48,
    "buyingPower": 225.46,
    "percentage": 15,
    "funded": true,
    "performance": {
      "total": 317.23,
      "percentage": 6.37,
      "period": "1Y"
    }
  }
]
```

**Status Codes:**
- 200: Success
- 401: Unauthorized

### Get Account by ID

```
GET /accounts/:id
```

Returns a specific account by ID.

**Response:**
```json
{
  "id": "U13186484",
  "alias": "Joaco",
  "type": "AUTOMATED_INVESTMENT",
  "value": 14692.92,
  "percentage": 35,
  "funded": true,
  "performance": {
    "total": -115.21,
    "percentage": -0.79,
    "period": "1Y"
  }
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Account not found

### Get Account Instruments

```
GET /accounts/:id/instruments
```

Returns the instruments (holdings) for a specific account.

**Response:**
```json
[
  {
    "symbol": "CSPX",
    "name": "Acciones EEUU S&P500",
    "value": 10129.14,
    "quantity": 49,
    "performance": -237.88,
    "percentage": 69.56,
    "color": "#3B9AE1"
  },
  {
    "symbol": "EIMI",
    "name": "Acciones Merc. Emerg.",
    "value": 1663.55,
    "quantity": 95,
    "performance": -4.23,
    "percentage": 11.42,
    "color": "#0066CC"
  }
]
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Account not found

### Get Account Performance

```
GET /accounts/:id/performance
```

Returns performance data for a specific account.

**Query Parameters:**
- `period`: The time period for performance data (e.g., "1M", "6M", "1Y", "inception")

**Response:**
```json
{
  "period": "1Y",
  "data": [
    {
      "date": "2024-05",
      "value": 1.25,
      "percentage": 1.25
    },
    {
      "date": "2024-06",
      "value": 2.31,
      "percentage": 2.31
    }
  ]
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Account not found

### Get Account Performance Stats

```
GET /accounts/:id/performance/stats
```

Returns summary performance statistics for a specific account.

**Response:**
```json
{
  "netGains": -307.08,
  "totalReturn": -2.06,
  "lastUpdate": "2025-04-11T00:00:00Z"
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Account not found

### Get Monthly Returns

```
GET /accounts/:id/performance/monthly
```

Returns monthly returns for a specific account.

**Response:**
```json
[
  {
    "month": "ABR 2025",
    "value": -5.36
  },
  {
    "month": "MAR 2025",
    "value": -4.03
  }
]
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Account not found

### Get Account Portfolio

```
GET /accounts/:id/portfolio
```

Returns the portfolio for a specific account.

**Response:**
```json
{
  "id": "portfolio-U13186484",
  "name": "Renta Variable",
  "type": "AUTOMATED_INVESTMENT",
  "allocation": [
    {
      "symbol": "CSPX",
      "name": "US Stocks",
      "percentage": 70.90,
      "color": "#3B9AE1"
    },
    {
      "symbol": "EIMI",
      "name": "Emerging Markets",
      "percentage": 10.70,
      "color": "#0066CC"
    }
  ]
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Account not found

### Update Portfolio

```
PUT /accounts/:id/portfolio
```

Updates the portfolio for a specific account.

**Request Body:**
```json
{
  "portfolioId": "blackrock-renta-variable"
}
```

**Response:**
```json
{
  "id": "blackrock-renta-variable",
  "accountId": "U13186484",
  "status": "pending"
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Account not found

### Get Portfolio Changes

```
GET /accounts/:id/portfolio-changes
```

Returns the portfolio change history for a specific account.

**Response:**
```json
[
  {
    "id": "PC003",
    "fromPortfolio": {
      "id": "blackrock-renta-variable",
      "name": "Renta Variable",
      "type": "RENTA VARIABLE",
      "stocksPercentage": 100,
      "bondsPercentage": 0,
      "allocation": [...]
    },
    "toPortfolio": {
      "id": "bcp-growth",
      "name": "Crecimiento",
      "type": "RENTA VARIABLE",
      "stocksPercentage": 100,
      "bondsPercentage": 0,
      "allocation": [...]
    },
    "requestDate": "2024-04-15",
    "status": "in_progress",
    "effectiveDate": "2024-04-22"
  }
]
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Account not found

### Cancel Portfolio Change

```
POST /accounts/:id/portfolio-changes/:changeId/cancel
```

Cancels a pending portfolio change.

**Response:**
```json
{
  "id": "PC003",
  "status": "cancelled"
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Account or change not found

## Transactions

### Get Account Transactions

```
GET /accounts/:id/transactions
```

Returns transactions for a specific account.

**Query Parameters:**
- `startDate`: Filter by start date (YYYY-MM-DD)
- `endDate`: Filter by end date (YYYY-MM-DD)
- `type`: Filter by transaction type (e.g., "RETIRO", "DEPÓSITO")
- `status`: Filter by status (e.g., "Completado", "Cancelado")
- `page`: Page number for pagination
- `limit`: Number of items per page

**Response:**
```json
{
  "transactions": [
    {
      "id": "T001",
      "date": "2024-11-06",
      "type": "RETIRO",
      "accountId": "U13186484",
      "alias": "Joaco",
      "amount": -10.00,
      "status": "Cancelado",
      "reason": "Necesidad de liquidez",
      "comment": "Test"
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 10
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Account not found

### Get Transaction by ID

```
GET /accounts/:id/transactions/:transactionId
```

Returns a specific transaction.

**Response:**
```json
{
  "id": "T001",
  "date": "2024-11-06",
  "type": "RETIRO",
  "accountId": "U13186484",
  "alias": "Joaco",
  "amount": -10.00,
  "status": "Cancelado",
  "reason": "Necesidad de liquidez",
  "comment": "Test"
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Transaction not found

### Create Withdrawal Request

```
POST /accounts/:id/withdrawals
```

Creates a new withdrawal request.

**Request Body:**
```json
{
  "withdrawalAccountId": "WA001",
  "amount": 500,
  "reason": "Necesidad de liquidez",
  "comment": "Retiro parcial"
}
```

**Response:**
```json
{
  "id": "T003",
  "date": "2025-04-17",
  "type": "RETIRO",
  "accountId": "U13186484",
  "alias": "Joaco",
  "amount": -500.00,
  "status": "Pendiente",
  "reason": "Necesidad de liquidez",
  "comment": "Retiro parcial"
}
```

**Status Codes:**
- 201: Created
- 400: Invalid request
- 401: Unauthorized
- 404: Account not found

## Withdrawal Accounts

### Get Withdrawal Accounts

```
GET /accounts/:id/withdrawal-accounts
```

Returns withdrawal accounts for a specific investment account.

**Response:**
```json
[
  {
    "id": "WA001",
    "alias": "BANK OF AMERICA, N...1213",
    "type": "bank",
    "accountNumber": "****1213",
    "status": "active",
    "country": "US",
    "currency": "USD",
    "routingNumber": "026009593"
  }
]
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Account not found

### Add Withdrawal Account

```
POST /accounts/:id/withdrawal-accounts
```

Adds a new withdrawal account.

**Request Body (multipart/form-data):**
```
alias: "My Bank Account"
type: "bank"
accountNumber: "123456789"
country: "US"
currency: "USD"
routingNumber: "021000021"
documents: [File1, File2]
```

**Response:**
```json
{
  "id": "WA009",
  "alias": "My Bank Account",
  "type": "bank",
  "accountNumber": "****6789",
  "status": "pending_review",
  "country": "US",
  "currency": "USD",
  "routingNumber": "021000021"
}
```

**Status Codes:**
- 201: Created
- 400: Invalid request
- 401: Unauthorized
- 404: Account not found

### Delete Withdrawal Account

```
DELETE /accounts/:id/withdrawal-accounts/:withdrawalAccountId
```

Deletes a withdrawal account.

**Response:**
```json
{
  "success": true
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Account or withdrawal account not found

## Statements

### Get Statements

```
GET /accounts/:id/statements
```

Returns statements for a specific account.

**Query Parameters:**
- `type`: Filter by statement type (e.g., "monthly", "annual")
- `year`: Filter by year
- `page`: Page number for pagination
- `limit`: Number of items per page

**Response:**
```json
{
  "statements": [
    {
      "id": "S001",
      "type": "monthly",
      "date": "2025-03-01",
      "year": "2025",
      "month": "MAR",
      "accountId": "U13186484",
      "url": "https://example.com/statements/202503.pdf"
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 10
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Account not found

### Get Tax Documents

```
GET /accounts/:id/tax-documents
```

Returns tax documents for a specific account.

**Query Parameters:**
- `year`: Filter by year

**Response:**
```json
[
  {
    "id": "T001",
    "type": "tax",
    "date": "2024-12-31",
    "year": "2024",
    "accountId": "U13186484",
    "documentId": "F1042S",
    "url": "https://example.com/tax/2024/F1042S.pdf"
  }
]
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Account not found

### Download Statement

```
GET /statements/:id/download
```

Downloads a specific statement.

**Response:**
Binary PDF file with appropriate headers:
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="statement.pdf"
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Statement not found

## Account Settings

### Get Account Settings

```
GET /accounts/:id/settings
```

Returns settings for a specific account.

**Response:**
```json
{
  "id": "U13186484",
  "alias": "Joaco",
  "type": "AUTOMATED_INVESTMENT",
  "accountType": "Individual",
  "holders": ["John Doe"],
  "documents": [
    {
      "id": "D001",
      "name": "Terms and Conditions",
      "date": "2024-01-15",
      "url": "https://example.com/documents/terms.pdf"
    }
  ],
  "support": {
    "email": "support@vestiva.com",
    "phone": "+1 (800) 555-0123"
  }
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Account not found

### Update Account Alias

```
PUT /accounts/:id/alias
```

Updates the alias for a specific account.

**Request Body:**
```json
{
  "alias": "New Alias"
}
```

**Response:**
```json
{
  "id": "U13186484",
  "alias": "New Alias",
  "type": "AUTOMATED_INVESTMENT",
  "accountType": "Individual",
  "holders": ["John Doe"],
  "documents": [...],
  "support": {...}
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Account not found

### Download Document

```
GET /accounts/:id/documents/:documentId/download
```

Downloads a specific document.

**Response:**
Binary PDF file with appropriate headers:
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="document.pdf"
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Document not found

## Widget API

### Validate Widget Token

```
POST /widgets/validate
```

Validates a widget token.

**Request Body:**
```json
{
  "token": "widget-token"
}
```

**Response:**
```json
{
  "valid": true,
  "clientId": "client_123",
  "permissions": ["read:accounts", "read:performance"]
}
```

**Status Codes:**
- 200: Success
- 401: Invalid token

### Generate Widget Token

```
POST /widgets/token
```

Generates a new widget token.

**Request Body:**
```json
{
  "clientId": "client_123",
  "permissions": ["read:accounts", "read:performance"]
}
```

**Response:**
```json
{
  "token": "widget-token"
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized

### Validate Domain

```
GET /widgets/domains/:domain
```

Validates if a domain is authorized for widget usage.

**Query Parameters:**
- `clientId`: Client ID

**Response:**
```json
{
  "isValid": true
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized

## Error Responses

All API endpoints return standardized error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {} // Optional additional details
}
```

Common error codes:
- `UNAUTHORIZED`: Authentication required or invalid token
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid request data
- `INTERNAL_ERROR`: Server error

## Rate Limiting

API requests are subject to rate limiting:
- 100 requests per minute per IP address
- 10,000 requests per day per IP address

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1619284800
```

When rate limits are exceeded, a 429 Too Many Requests response is returned:
```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "details": {
    "retryAfter": 60
  }
}
```