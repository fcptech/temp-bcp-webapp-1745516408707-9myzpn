# Capas de la Aplicación

## 1. Capa de Presentación

### Componentes (`/components`)
- Componentes de UI reutilizables
- Enfoque en presentación y experiencia de usuario
- Stateless cuando sea posible
- Props tipadas y documentadas

### Páginas (`/pages`)
- Componentes de nivel superior para rutas
- Composición de componentes más pequeños
- Manejo de estado de página
- Integración con servicios a través de hooks

## 2. Capa de Lógica de Negocio

### Hooks (`/hooks`)
- Encapsulan lógica de negocio reutilizable
- Integran servicios con React Query
- Manejan estado local complejo
- Proporcionan interfaces tipadas

### Contextos (`/contexts`)
- Estado global de la aplicación
- Providers para funcionalidad compartida
- Configuración de servicios globales
- Gestión de temas y localización

## 3. Capa de Servicios

### Servicios API (`/services`)
- Comunicación con backend
- Validación de datos con Zod
- Transformación de datos
- Manejo de errores consistente

### Configuración (`/config`)
- Configuración de servicios
- Constantes globales
- Interceptores de API
- Variables de entorno tipadas