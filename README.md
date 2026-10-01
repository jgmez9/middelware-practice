# Reservations API - NestJS Request Flow

API de reservas de restaurante desarrollada con NestJS para practicar el ciclo de una petición HTTP:

`Request → Middleware → Guard → Interceptor → Pipe → Controller → Service → Interceptor → Response`

Los errores HTTP son procesados por un Exception Filter.

## Tecnologías

- NestJS 12
- TypeScript
- class-validator
- class-transformer
- RxJS
- Vitest
- Sin base de datos: las reservas se almacenan temporalmente en memoria.

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm run start:dev
```

Servidor:

```text
http://localhost:3000
```

## Endpoints

### GET /reservations

Endpoint público.

```bash
curl http://localhost:3000/reservations
```

### GET /reservations/:id

Endpoint público.

```bash
curl http://localhost:3000/reservations/1
```

### POST /reservations

Requiere el header:

```text
x-api-key: restaurant-secret
```

Body:

```json
{
  "customerName": "Carlos Pérez",
  "email": "carlos@email.com",
  "people": 4
}
```

## Componentes

### Middleware

`LoggerMiddleware` registra método, ruta, hora, código de respuesta y duración aproximada de cada petición de reservations.

### Guard

`ApiKeyGuard` protege únicamente `POST /reservations`. Si la API Key falta o es incorrecta, responde `403 Forbidden`.

### ValidationPipe

Se configura globalmente con:

- `whitelist: true`
- `forbidNonWhitelisted: true`
- `transform: true`

El DTO valida nombre, email y cantidad de personas.

### Interceptor

`ResponseInterceptor` transforma las respuestas exitosas a:

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-09-30T00:00:00.000Z"
}
```

### Exception Filter

`HttpExceptionFilter` unifica las respuestas de errores HTTP:

```json
{
  "success": false,
  "statusCode": 403,
  "message": "Invalid or missing API Key",
  "path": "/reservations",
  "timestamp": "2026-09-30T00:00:00.000Z"
}
```

## Pruebas mínimas

1. POST válido con API Key → `201` y respuesta uniforme.
2. POST sin API Key → `403`.
3. POST con API Key incorrecta → `403`.
4. POST con email inválido → `400` por validación.
5. POST con `people: 0` → `400` por validación.
6. POST con email repetido → `400` por regla de negocio.
7. GET /reservations → listado público.
8. Petición normal → registro visible en consola.
9. Error HTTP → estructura uniforme mediante Filter.

## Tests automatizados

```bash
npm test
```

## Estructura relevante

```text
src/
├── common/
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── guards/
│   │   └── api-key.guard.ts
│   ├── interceptors/
│   │   └── response.interceptor.ts
│   └── middleware/
│       └── logger.middleware.ts
├── reservations/
│   ├── dto/
│   │   ├── create-reservation.dto.ts
│   │   └── update-reservation.dto.ts
│   ├── entities/
│   │   └── reservation.entity.ts
│   ├── reservations.controller.ts
│   ├── reservations.module.ts
│   └── reservations.service.ts
├── app.module.ts
└── main.ts
```
