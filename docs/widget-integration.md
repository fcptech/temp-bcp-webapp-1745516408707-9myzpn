# Widget Integration Guide

## Quick Start

```html
<script src="https://leafy-selkie-648752.netlify.app/widget/widget.js"></script>

<script>
const config = {
  onSuccess: (result) => {
    console.log('Success:', result);
  },
  onExit: () => {
    console.log('User exited');
  },
  onEvent: (eventName, metadata) => {
    console.log('Event:', eventName, metadata);
  }
};

const { open, exit } = VestivaWidget.create({
  // Required
  clientName: 'Your App Name',
  token: 'your-token',
  
  // Optional
  theme: 'light',
  language: 'en',
  products: ['AUTOMATED_INVESTMENT', 'MARKET_HUB'],
  
  // Callbacks
  onSuccess: config.onSuccess,
  onExit: config.onExit,
  onEvent: config.onEvent
});

// Open widget
document.querySelector('#start').onclick = () => {
  open();
};

// Close widget
document.querySelector('#close').onclick = () => {
  exit();
};
</script>
```

## React Integration

```tsx
import { useVestivaWidget } from '@vestiva/widget-react';

function App() {
  const config = {
    clientName: 'Your App Name',
    token: 'your-token',
    onSuccess: (result) => {
      console.log('Success:', result);
    },
    onExit: () => {
      console.log('User exited');
    },
    onEvent: (eventName, metadata) => {
      console.log('Event:', eventName, metadata);
    }
  };

  const { open, ready, error } = useVestivaWidget(config);

  return (
    <button
      onClick={() => open()}
      disabled={!ready || !!error}
    >
      Connect Investment Account
    </button>
  );
}
```

## Configuration Options

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| clientName | string | Yes | Your application name |
| token | string | Yes | Integration token |
| theme | 'light' \| 'dark' | No | Widget theme |
| language | 'en' \| 'es' \| 'pt' | No | Widget language |
| products | Array<'AUTOMATED_INVESTMENT' \| 'MARKET_HUB'> | No | Products to show |

## Callbacks

### onSuccess
Called when a user successfully completes the flow.

```typescript
interface SuccessMetadata {
  accounts: Array<{
    id: string;
    type: 'AUTOMATED_INVESTMENT' | 'MARKET_HUB';
    value: number;
  }>;
  user: {
    id: string;
    email: string;
  };
}

function onSuccess(metadata: SuccessMetadata) {
  // Handle success
}
```

### onExit
Called when a user exits the flow.

```typescript
interface ExitMetadata {
  status: 'completed' | 'cancelled' | 'error';
  error?: {
    type: string;
    code: string;
    message: string;
  };
}

function onExit(metadata: ExitMetadata) {
  // Handle exit
}
```

### onEvent
Called when events occur during the flow.

```typescript
type EventName = 
  | 'OPEN' 
  | 'EXIT' 
  | 'HANDOFF' 
  | 'SELECT_ACCOUNT' 
  | 'SUBMIT_CREDENTIALS';

function onEvent(eventName: EventName, metadata: any) {
  // Handle event
}
```

## OAuth Integration

For OAuth-based authentication flows:

```typescript
const config = {
  clientName: 'Your App Name',
  token: 'your-token',
  receivedRedirectUri: window.location.href,
  oauthRedirectUri: 'https://your-app.com/oauth-return',
  oauthNonce: generateNonce(), // Implement this
};

const { open } = VestivaWidget.create(config);
```

## Error Handling

```typescript
const { open, ready, error } = useVestivaWidget({
  clientName: 'Your App Name',
  token: 'your-token',
  onError: (error) => {
    console.error('Widget error:', error);
  }
});

if (error) {
  // Handle initialization error
}
```

## Customization

### Theme Customization

```typescript
const config = {
  theme: {
    colors: {
      primary: '#002060',
      secondary: '#003087',
      accent: '#0047BB',
    },
    borderRadius: '8px',
    fontFamily: 'Inter, system-ui, sans-serif'
  }
};
```

### Custom Content

```typescript
const config = {
  customContent: {
    'WELCOME_SCREEN.TITLE': 'Connect your investment account',
    'WELCOME_SCREEN.SUBTITLE': 'Securely connect your investment accounts',
    'EXIT_SCREEN.TITLE': 'Are you sure?',
  }
};
```

## Security Considerations

1. **Token Security**
   - Never expose your secret token in client-side code
   - Generate temporary tokens server-side
   - Implement token rotation

2. **Domain Verification**
   - Register allowed domains in your dashboard
   - Implement CORS policies
   - Use Content Security Policy (CSP)

3. **Data Handling**
   - Never store sensitive data client-side
   - Implement secure session management
   - Follow data minimization principles

## Example Implementation

```html
<!DOCTYPE html>
<html>
<head>
  <title>Vestiva Widget Demo</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  
  <!-- CSP Headers -->
  <meta http-equiv="Content-Security-Policy" content="
    default-src 'self' https://leafy-selkie-648752.netlify.app;
    script-src 'self' https://leafy-selkie-648752.netlify.app 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
  ">
</head>
<body>
  <button id="start">Connect Investment Account</button>

  <script src="https://leafy-selkie-648752.netlify.app/widget/widget.js"></script>
  <script>
    // Initialize widget
    const { open, exit } = VestivaWidget.create({
      clientName: 'Demo App',
      token: 'your-token',
      theme: 'light',
      language: 'en',
      products: ['AUTOMATED_INVESTMENT', 'MARKET_HUB'],
      
      onSuccess: (result) => {
        console.log('Success:', result);
        // Send result to your backend
        fetch('/api/complete-connection', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(result)
        });
      },
      
      onExit: ({ status, error }) => {
        if (status === 'error') {
          console.error('Error:', error);
        }
        // Clean up and reset UI
      },
      
      onEvent: (eventName, metadata) => {
        // Track events for analytics
        analytics.track(eventName, metadata);
      }
    });

    // Add click handler
    document.getElementById('start').onclick = () => {
      open();
    };
  </script>
</body>
</html>
```