# Backend API

.NET 8 Web API following organization standards.

## Building

```bash
dotnet restore
dotnet build
```

## Running

```bash
dotnet run --project src/Api
```

API available at `http://localhost:5000` with Swagger at `/swagger`.

## Testing

```bash
dotnet test
```

## Project Layout

- `src/Api/` - Main API project
  - `Controllers/` - API controllers
  - `DTOs/` - Data transfer objects
  - `Services/` - Business logic layer
  - `Repositories/` - Data access layer
  - `Domain/` - Domain entities
  - `Middleware/` - Custom middleware
  - `Extensions/` - Extension methods
- `tests/Api.Tests/` - Unit and integration tests
