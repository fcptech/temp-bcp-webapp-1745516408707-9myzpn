# Seguridad

## 1. Autenticación

### Flujo de Autenticación
1. Login con credenciales
2. Recepción y almacenamiento seguro de token
3. Interceptor para incluir token en requests
4. Refresh automático de tokens
5. Logout y limpieza de datos

### Implementación
```typescript
// Interceptor de autenticación
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

## 2. Manejo de Secretos

### Variables de Entorno
- Uso de `.env` para configuración
- Tipado con TypeScript
- Validación en build time
- No exposición en cliente

### Ejemplo de Configuración
```typescript
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_AUTH_TOKEN: string
  readonly VITE_ENVIRONMENT: string
}
```

## 3. Protección de Datos

### Validación
- Schemas de Zod en todas las entradas
- Sanitización de datos
- Tipado estricto

### Almacenamiento
- Tokens en localStorage
- Datos sensibles no persistidos
- Limpieza en logout