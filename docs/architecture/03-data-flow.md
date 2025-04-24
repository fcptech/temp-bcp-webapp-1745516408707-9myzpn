# Flujo de Datos

## 1. Validación de Datos

### Schemas de Zod
```typescript
// Ejemplo de schema para validación
const accountSchema = z.object({
  id: z.string(),
  alias: z.string(),
  type: z.string(),
  value: z.number(),
  percentage: z.number()
});
```

### Proceso de Validación
1. Datos recibidos de API
2. Validación con Zod
3. Tipado automático con TypeScript
4. Propagación a componentes

## 2. Gestión de Estado

### React Query
- Caché de datos del servidor
- Revalidación automática
- Manejo de estado de carga y error
- Mutations optimistas

### Ejemplo de Flujo
```typescript
// 1. Definición en servicio
class AccountsService {
  static async getAccounts() {
    const response = await api.get('/accounts');
    return z.array(accountSchema).parse(response.data);
  }
}

// 2. Hook personalizado
function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: () => AccountsService.getAccounts()
  });
}

// 3. Uso en componente
function AccountsList() {
  const { data, isLoading } = useAccounts();
  // Renderizado con datos tipados
}
```

## 3. Manejo de Errores

### Niveles de Error
1. **Validación de Datos**
   - Zod para validación de schema
   - TypeScript para errores de tipo

2. **Errores de API**
   - Interceptores globales
   - Manejo de errores HTTP
   - Refresh de tokens

3. **Errores de UI**
   - Boundaries de error
   - Feedback al usuario
   - Estados de carga