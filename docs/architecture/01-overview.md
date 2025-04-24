# Arquitectura de la Aplicación

## Visión General

La aplicación sigue una arquitectura en capas con un enfoque en la separación de responsabilidades, mantenibilidad y escalabilidad. Está construida utilizando React y TypeScript, con un fuerte énfasis en la tipificación estática y la validación de datos en tiempo de ejecución.

## Estructura de Directorios

```
src/
├── components/     # Componentes reutilizables de UI
├── config/        # Configuración de servicios y constantes
├── contexts/      # Contextos de React y providers
├── hooks/         # Custom hooks para lógica reutilizable
├── pages/         # Componentes de página/ruta
├── services/      # Servicios para comunicación con API
├── styles/        # Estilos globales y utilidades
├── types/         # Definiciones de tipos TypeScript
└── i18n/          # Internacionalización
```

## Principios de Diseño

1. **Separación de Responsabilidades**
   - Cada capa tiene una responsabilidad única y bien definida
   - La lógica de negocio está separada de la UI
   - Los servicios encapsulan la comunicación con APIs

2. **Type Safety**
   - TypeScript para tipado estático
   - Zod para validación de datos en runtime
   - Interfaces y tipos bien definidos

3. **Gestión de Estado**
   - React Query para estado del servidor
   - Contextos de React para estado global
   - Estado local para componentes cuando sea apropiado

4. **Seguridad**
   - Variables de entorno para secretos
   - Validación de datos en todas las capas
   - Manejo seguro de tokens y autenticación