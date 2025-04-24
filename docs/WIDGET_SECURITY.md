# Widget Security Implementation

## Overview

The widget security system is designed to ensure secure integration and usage of Vestiva widgets in third-party applications, following industry best practices similar to Plaid's implementation.

```
┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│   Client App     │         │  Vestiva Widget  │         │  Vestiva Server  │
│                  │         │                  │         │                  │
│ ┌──────────────┐ │    1    │ ┌──────────────┐ │    2    │ ┌──────────────┐ │
│ │  Public Key  │─┼─────────┼▶│Token Validator│─┼─────────┼▶│ Auth Service │ │
│ └──────────────┘ │         │ └──────────────┘ │         │ └──────────────┘ │
│                  │         │                  │         │        │         │
│ ┌──────────────┐ │    4    │ ┌──────────────┐ │    3    │        ▼         │
│ │  Widget UI   │◀┼─────────┼─│  Widget SDK  │◀┼─────────┼─│ ┌──────────────┐ │
│ └──────────────┘ │         │ └──────────────┘ │         │ │Domain Service│ │
│                  │         │                  │         │ └──────────────┘ │
└──────────────────┘         └──────────────────┘         └──────────────────┘
```

## Security Components

### 1. Authentication Keys

```typescript
interface ClientKeys {
  publicKey: string;    // Used in client-side code
  privateKey: string;   // Stored securely on server
  clientId: string;     // Unique client identifier
}

interface WidgetToken {
  token: string;        // JWT token
  expiresAt: number;    // Expiration timestamp
  permissions: string[]; // Allowed widget features
}
```

### 2. Domain Validation

```typescript
interface DomainConfig {
  domain: string;           // Authorized domain
  allowedOrigins: string[]; // Additional allowed origins
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

interface ValidationResult {
  isValid: boolean;
  domain: string;
  error?: string;
}
```

## Implementation Steps

### 1. Client Setup

1. Register your application:
   ```typescript
   interface ClientRegistration {
     companyName: string;
     domain: string;
     contactEmail: string;
     callbackUrl: string;
     environment: 'sandbox' | 'production';
   }
   ```

2. Receive credentials:
   ```json
   {
     "clientId": "client_live_1234567890",
     "publicKey": "pk_live_abcdefghijk",
     "privateKey": "sk_live_zyxwvutsrqp"
   }
   ```

### 2. Widget Integration

1. Initialize widget with public key:
   ```javascript
   const widget = new VestivaWidget({
     publicKey: 'pk_live_abcdefghijk',
     environment: 'production',
     onSuccess: (result) => {
       console.log('Widget loaded:', result);
     },
     onError: (error) => {
       console.error('Widget error:', error);
     }
   });
   ```

2. Server-side token generation:
   ```typescript
   interface TokenRequest {
     clientId: string;
     privateKey: string;
     domain: string;
     permissions?: string[];
   }

   // Server endpoint
   app.post('/api/widget-token', async (req, res) => {
     const { clientId, privateKey, domain } = req.body;
     
     // Validate client credentials
     const client = await validateClient(clientId, privateKey);
     if (!client) {
       return res.status(401).json({ error: 'Invalid credentials' });
     }
     
     // Validate domain
     const isDomainValid = await validateDomain(domain, client.id);
     if (!isDomainValid) {
       return res.status(403).json({ error: 'Unauthorized domain' });
     }
     
     // Generate widget token
     const token = generateWidgetToken(client, domain);
     res.json({ token });
   });
   ```

### 3. Domain Validation

1. Domain registration:
   ```sql
   CREATE TABLE authorized_domains (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     client_id UUID NOT NULL REFERENCES clients(id),
     domain VARCHAR(255) NOT NULL,
     status VARCHAR(50) DEFAULT 'active',
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW(),
     UNIQUE(client_id, domain)
   );
   ```

2. Validation process:
   ```typescript
   async function validateDomain(domain: string, clientId: string): Promise<boolean> {
     // 1. Check if domain is registered
     const domainConfig = await getDomainConfig(domain, clientId);
     if (!domainConfig) return false;
     
     // 2. Verify domain status
     if (domainConfig.status !== 'active') return false;
     
     // 3. Check allowed origins
     const origin = new URL(domain).origin;
     return domainConfig.allowedOrigins.includes(origin);
   }
   ```

### 4. Token Validation

1. Token structure:
   ```typescript
   interface WidgetTokenPayload {
     iss: string;        // Token issuer (Vestiva)
     sub: string;        // Client ID
     aud: string;        // Domain
     exp: number;        // Expiration timestamp
     iat: number;        // Issued at timestamp
     jti: string;        // Unique token ID
     permissions: string[]; // Allowed widget features
   }
   ```

2. Validation process:
   ```typescript
   async function validateWidgetToken(token: string, domain: string): Promise<boolean> {
     try {
       // 1. Decode and verify token
       const payload = jwt.verify(token, publicKey) as WidgetTokenPayload;
       
       // 2. Check expiration
       if (Date.now() >= payload.exp * 1000) return false;
       
       // 3. Verify domain
       if (payload.aud !== domain) return false;
       
       // 4. Check if token is revoked
       const isRevoked = await checkTokenRevocation(payload.jti);
       if (isRevoked) return false;
       
       return true;
     } catch (error) {
       return false;
     }
   }
   ```

## Security Measures

### 1. Token Security

- Short-lived tokens (max 1 hour)
- Domain-specific tokens
- Token revocation support
- Secure token transmission

### 2. Domain Security

- Domain verification required
- Subdomain support
- Wildcard domain restrictions
- Regular domain validation

### 3. Request Security

- Rate limiting
- CORS validation
- Request signing
- Timestamp validation

### 4. Data Security

- End-to-end encryption
- Data minimization
- Secure storage
- Audit logging

## Integration Example

```typescript
// Server-side token generation
app.post('/api/widget-token', async (req, res) => {
  try {
    // 1. Validate request
    const { clientId, privateKey } = req.body;
    if (!clientId || !privateKey) {
      return res.status(400).json({ error: 'Missing credentials' });
    }

    // 2. Validate client
    const client = await validateClient(clientId, privateKey);
    if (!client) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. Get domain from request
    const domain = req.headers.origin;
    if (!domain) {
      return res.status(400).json({ error: 'Missing origin' });
    }

    // 4. Validate domain
    const isDomainValid = await validateDomain(domain, client.id);
    if (!isDomainValid) {
      return res.status(403).json({ error: 'Unauthorized domain' });
    }

    // 5. Generate token
    const token = jwt.sign(
      {
        iss: 'vestiva',
        sub: client.id,
        aud: domain,
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
        iat: Math.floor(Date.now() / 1000),
        jti: uuidv4(),
        permissions: client.permissions
      },
      privateKey,
      { algorithm: 'RS256' }
    );

    // 6. Return token
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Client-side integration
const initWidget = async () => {
  try {
    // 1. Get widget token from your server
    const response = await fetch('/api/widget-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clientId: 'your-client-id',
        privateKey: 'your-private-key'
      })
    });
    
    const { token } = await response.json();
    
    // 2. Initialize widget with token
    const widget = new VestivaWidget({
      token,
      environment: 'production',
      onSuccess: (result) => {
        console.log('Widget loaded:', result);
      },
      onError: (error) => {
        console.error('Widget error:', error);
      }
    });
    
    // 3. Open widget
    widget.open();
  } catch (error) {
    console.error('Failed to initialize widget:', error);
  }
};
```

## Best Practices

1. **Key Management**
   - Store private keys securely
   - Rotate keys regularly
   - Use environment-specific keys
   - Monitor key usage

2. **Domain Validation**
   - Verify domain ownership
   - Regular revalidation
   - Strict CORS policies
   - Domain activity monitoring

3. **Token Handling**
   - Short token lifetimes
   - Secure token storage
   - Token refresh mechanism
   - Token revocation support

4. **Error Handling**
   - Graceful degradation
   - User-friendly errors
   - Detailed logging
   - Error tracking

5. **Security Headers**
   ```typescript
   // Server-side security headers
   app.use(helmet({
     contentSecurityPolicy: {
       directives: {
         defaultSrc: ["'self'"],
         scriptSrc: ["'self'", "*.vestiva.com"],
         styleSrc: ["'self'", "*.vestiva.com"],
         imgSrc: ["'self'", "data:", "*.vestiva.com"],
         connectSrc: ["'self'", "*.vestiva.com"],
         frameSrc: ["'self'", "*.vestiva.com"],
         frameAncestors: ["'self'", "*.authorized-domain.com"]
       }
     },
     referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
   }));
   ```

## Security Checklist

- [ ] Implement client registration system
- [ ] Set up key management
- [ ] Create domain validation
- [ ] Implement token generation
- [ ] Add request signing
- [ ] Configure CORS policies
- [ ] Set up monitoring
- [ ] Implement audit logging
- [ ] Create incident response plan
- [ ] Document security procedures