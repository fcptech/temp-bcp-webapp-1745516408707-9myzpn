# API y Servicios

## Estructura

### 1. Servicios Base
```typescript
// Configuración base de API
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 2. Validación de Datos
```typescript
// Schemas de validación
const accountSchema = z.object({
  id: z.string(),
  alias: z.string(),
  type: z.enum(['AUTOMATED_INVESTMENT', 'MARKET_HUB']),
  value: z.number(),
  percentage: z.number(),
  buyingPower: z.number().optional(),
  performance: z.object({
    total: z.number(),
    percentage: z.number(),
    period: z.string()
  })
});
```

## Servicios

### 1. Accounts Service
```typescript
export class AccountsService {
  static async getAccounts() {
    const response = await api.get('/accounts');
    return z.array(accountSchema).parse(response.data);
  }

  static async getAccount(id: string) {
    const response = await api.get(`/accounts/${id}`);
    return accountSchema.parse(response.data);
  }

  static async getAccountPerformance(id: string, period: string) {
    const response = await api.get(`/accounts/${id}/performance`, {
      params: { period }
    });
    return response.data;
  }
}
```

### 2. Market Hub Service
```typescript
export class MarketHubService {
  static async getInstruments(accountId: string) {
    const response = await api.get(`/accounts/${accountId}/instruments`);
    return z.array(instrumentSchema).parse(response.data);
  }

  static async placeOrder(accountId: string, order: Order) {
    const response = await api.post(`/accounts/${accountId}/orders`, order);
    return orderSchema.parse(response.data);
  }

  static async getWatchlists(accountId: string) {
    const response = await api.get(`/accounts/${accountId}/watchlists`);
    return z.array(watchlistSchema).parse(response.data);
  }
}
```

### 3. Widget Service
```typescript
export class WidgetService {
  static async validateToken(token: string) {
    const response = await api.post('/widgets/validate', { token });
    return widgetAuthSchema.parse(response.data);
  }

  static async validateDomain(domain: string) {
    const response = await api.get(`/widgets/domains/${domain}`);
    return response.data.isValid;
  }
}
```

## Hooks

### 1. Account Hooks
```typescript
export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => AccountsService.getAccounts()
  });
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: ['accounts', id],
    queryFn: () => AccountsService.getAccount(id),
    enabled: !!id
  });
}
```

### 2. Market Hub Hooks
```typescript
export function useInstruments(accountId: string) {
  return useQuery({
    queryKey: ['instruments', accountId],
    queryFn: () => MarketHubService.getInstruments(accountId),
    enabled: !!accountId
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (order: Order) => 
      MarketHubService.placeOrder(order.accountId, order),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['instruments', variables.accountId] 
      });
    }
  });
}
```

## Manejo de Errores

### 1. Interceptores
```typescript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or logout
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 2. Validación
```typescript
try {
  const data = accountSchema.parse(response.data);
  return data;
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Validation error:', error.errors);
    throw new Error('Invalid data format');
  }
  throw error;
}
```

## Seguridad

### 1. Autenticación
```typescript
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
```

### 2. CORS
```typescript
// Configuración del servidor
const allowedOrigins = [
  'https://your-domain.com',
  'https://your-app.com'
];

// Headers en respuestas
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};
```