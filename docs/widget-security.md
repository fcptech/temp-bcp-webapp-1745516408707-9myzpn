# Seguridad y Uso de Widgets

## Autenticación

### 1. Obtención del Token

Para integrar los widgets, primero debes obtener un token de acceso:

1. Accede al [Dashboard de Desarrolladores](https://dashboard.example.com)
2. Crea un nuevo proyecto
3. Genera un token de API con los permisos necesarios
4. Configura los dominios permitidos

```typescript
interface WidgetConfig {
  containerId: string;
  token: string;        // Token de API requerido
  theme?: 'light' | 'dark';
  language?: 'en' | 'es' | 'pt';
  mode?: 'standalone' | 'embedded';
  view?: 'dashboard' | 'account';
  accountId?: string;   // Requerido para view: 'account'
}
```

### 2. Validación de Dominio

Los widgets solo pueden ser embebidos en dominios autorizados:

```javascript
// ✅ Correcto: Dominio autorizado
const widget = new VestivaWidget({
  containerId: 'widget-container',
  token: 'your-api-token',
  // ...otras opciones
});

// ❌ Incorrecto: Dominio no autorizado
// El widget no se inicializará y mostrará un error
```

### 3. Permisos

Los tokens pueden tener diferentes niveles de permisos:

- `read:accounts` - Ver información básica de cuentas
- `read:transactions` - Ver transacciones
- `read:statements` - Acceder a estados de cuenta
- `read:performance` - Ver datos de rendimiento

## Integración

### 1. Script Loader

```html
<!-- 1. Agregar el script loader -->
<script src="https://widgets.vestiva.com/loader.js"></script>

<!-- 2. Crear contenedor -->
<div id="vestiva-widget"></div>

<!-- 3. Inicializar widget -->
<script>
window.initVestivaWidget({
  containerId: 'vestiva-widget',
  token: 'your-api-token',
  theme: 'light',
  language: 'es',
  mode: 'embedded',
  view: 'dashboard'
});
</script>
```

### 2. Web Component

```html
<!-- 1. Importar definición del componente -->
<script type="module" src="https://widgets.vestiva.com/components.js"></script>

<!-- 2. Usar el componente -->
<vestiva-dashboard
  token="your-api-token"
  theme="light"
  language="es"
></vestiva-dashboard>

<!-- O para una cuenta específica -->
<vestiva-account
  token="your-api-token"
  account-id="U13186484"
  theme="light"
  language="es"
></vestiva-account>
```

### 3. React Component

```tsx
import { VestivaDashboard, VestivaAccount } from '@vestiva/react-widgets';

// Dashboard Widget
function App() {
  return (
    <VestivaDashboard
      token="your-api-token"
      theme="light"
      language="es"
    />
  );
}

// Account Widget
function App() {
  return (
    <VestivaAccount
      token="your-api-token"
      accountId="U13186484"
      theme="light"
      language="es"
    />
  );
}
```

## Seguridad

### 1. Aislamiento

Los widgets utilizan Shadow DOM para garantizar:
- Aislamiento de estilos
- Encapsulación de DOM
- Prevención de conflictos con la aplicación principal

### 2. Validación de Datos

Toda la información se valida en múltiples niveles:

```typescript
// 1. Validación de configuración
const widgetConfigSchema = z.object({
  token: z.string(),
  containerId: z.string(),
  theme: z.enum(['light', 'dark']).optional(),
  language: z.enum(['en', 'es', 'pt']).optional(),
  mode: z.enum(['standalone', 'embedded']).optional(),
  view: z.enum(['dashboard', 'account']).optional(),
  accountId: z.string().optional(),
});

// 2. Validación de autenticación
const widgetAuthSchema = z.object({
  token: z.string(),
  domain: z.string().url(),
  accountId: z.string().optional(),
  permissions: z.array(z.string())
});
```

### 3. CORS y CSP

Configuración recomendada para Content Security Policy:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' https://widgets.vestiva.com;
  style-src 'self' 'unsafe-inline';
  connect-src https://api.vestiva.com;
">
```

### 4. Rate Limiting

Los tokens tienen límites de uso:
- 100 requests/minuto por token
- 10,000 requests/día por token
- Monitoreo de uso en el Dashboard

## Monitoreo

### 1. Errores Comunes

```typescript
// Validar estado del widget
const status = await widget.getStatus();

// Verificar errores específicos
if (status.error === 'TOKEN_INVALID') {
  // Token inválido o expirado
}

if (status.error === 'DOMAIN_UNAUTHORIZED') {
  // Dominio no autorizado
}

if (status.error === 'RATE_LIMIT_EXCEEDED') {
  // Límite de requests excedido
}
```

### 2. Eventos

Los widgets emiten eventos que puedes escuchar:

```typescript
widget.on('error', (error) => {
  console.error('Widget error:', error);
});

widget.on('ready', () => {
  console.log('Widget loaded successfully');
});

widget.on('data', (data) => {
  console.log('Widget data updated:', data);
});
```

## Mejores Prácticas

1. **Manejo de Tokens**
   - No expongas tokens en el código cliente
   - Usa un proxy en tu backend para obtener tokens
   - Rota los tokens regularmente

2. **Performance**
   - Carga los widgets de forma lazy
   - Usa el modo embedded para mejor integración
   - Implementa caching cuando sea posible

3. **UX**
   - Muestra estados de carga apropiados
   - Maneja errores de forma elegante
   - Mantén consistencia visual con tu aplicación

4. **Seguridad**
   - Valida todos los inputs
   - Implementa timeouts adecuados
   - Monitorea el uso de los widgets