# Tipos de Cuenta

## 1. Automated Investment

### Descripción
Cuenta de inversión automatizada que permite a los usuarios invertir en portafolios predefinidos y gestionados profesionalmente.

### Características
- Portafolios predefinidos
- Rebalanceo automático
- Inversión pasiva
- Diversificación global

### Estructura de Datos
```typescript
interface AutomatedInvestmentAccount {
  id: string;
  alias: string;
  type: 'AUTOMATED_INVESTMENT';
  value: number;
  percentage: number;
  performance: {
    total: number;
    percentage: number;
    period: string;
  };
}
```

### Portafolios Disponibles
1. **BlackRock Long-Horizon**
   - Enfoque en crecimiento a largo plazo
   - Alta exposición a renta variable
   - Diversificación global

2. **BCP Portfolios**
   - Estrategias balanceadas
   - Combinación de renta fija y variable
   - Enfoque regional

3. **Vanguard ETFs**
   - Costos reducidos
   - Alta liquidez
   - Exposición a índices

### Funcionalidades
- Cambio de portafolio
- Visualización de composición
- Seguimiento de rendimiento
- Estados de cuenta
- Actividad de la cuenta

## 2. Market Hub

### Descripción
Cuenta de trading que permite a los usuarios operar directamente acciones y ETFs en los mercados financieros.

### Características
- Trading directo
- Watchlists personalizadas
- Monitor de órdenes
- Poder de compra
- Análisis por instrumento

### Estructura de Datos
```typescript
interface MarketHubAccount {
  id: string;
  alias: string;
  type: 'MARKET_HUB';
  value: number;
  percentage: number;
  buyingPower: number;
  performance: {
    total: number;
    percentage: number;
    period: string;
  };
}

interface Instrument {
  symbol: string;
  name: string;
  sector?: string;
  price: number;
  quantity: number;
  value: number;
  performance: number;
  logoUrl?: string;
}
```

### Funcionalidades
1. **Trading**
   - Compra de instrumentos
   - Venta de posiciones
   - Órdenes limitadas
   - Órdenes de mercado

2. **Watchlists**
   - Creación de listas
   - Seguimiento de instrumentos
   - Alertas de precio
   - Favoritos

3. **Análisis**
   - Gráficos técnicos
   - Información fundamental
   - Noticias del mercado
   - Análisis de rendimiento

4. **Monitor de Órdenes**
   - Estado de órdenes
   - Historial de operaciones
   - Cancelación de órdenes
   - Modificación de órdenes

### Seguridad
- Validación de órdenes
- Límites de operación
- Protección de saldo
- Confirmaciones de operaciones

## Integración en Widgets

### Dashboard Widget
```typescript
// Configuración para mostrar todas las cuentas
<vestiva-dashboard
  token="your-api-token"
  theme="light"
  language="es"
  sections={[
    'summary',
    'distribution',
    'accounts'
  ]}
/>
```

### Account Widget
```typescript
// Configuración para cuenta Automated Investment
<vestiva-account
  token="your-api-token"
  account-id="U13186484"
  account-type="AUTOMATED_INVESTMENT"
  theme="light"
  language="es"
  sections={[
    'summary-graph',
    'summary-portfolio',
    'summary-instruments',
    'performance',
    'activity',
    'statements'
  ]}
/>

// Configuración para cuenta Market Hub
<vestiva-account
  token="your-api-token"
  account-id="U10246500"
  account-type="MARKET_HUB"
  theme="light"
  language="es"
  sections={[
    'summary-graph',
    'summary-actions',
    'summary-instruments',
    'performance',
    'activity',
    'statements'
  ]}
/>
```