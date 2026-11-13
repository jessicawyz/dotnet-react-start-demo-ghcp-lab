# Build: dotnet-react-starter Template Application

## Overview

Create a minimal full-stack application with:
- **Backend:** .NET 8 Web API
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Purpose:** Starter template for demonstrating GitHub Copilot capabilities

This app must follow ALL standards defined in `.github/copilot-instructions.md` (included below).

---

## Repository Structure to Create

```
dotnet-react-starter/
├── backend/
│   ├── src/
│   │   └── Api/
│   │       ├── Api.csproj
│   │       ├── Program.cs
│   │       ├── appsettings.json
│   │       ├── appsettings.Development.json
│   │       ├── Controllers/
│   │       │   └── HealthController.cs
│   │       ├── DTOs/
│   │       │   ├── Common/
│   │       │   │   ├── ItemResponseDto.cs
│   │       │   │   ├── CollectionResponseDto.cs
│   │       │   │   ├── MetadataDto.cs
│   │       │   │   ├── LinksDto.cs
│   │       │   │   └── ErrorResponseDto.cs
│   │       │   └── Health/
│   │       │       └── HealthResponseDto.cs
│   │       ├── Middleware/
│   │       │   └── TransactionIdMiddleware.cs
│   │       ├── Extensions/
│   │       │   └── ServiceCollectionExtensions.cs
│   │       ├── Swagger/
│   │       │   └── README.md
│   │       ├── Services/
│   │       │   └── README.md
│   │       ├── Repositories/
│   │       │   └── README.md
│   │       └── Domain/
│   │           └── README.md
│   ├── tests/
│   │   └── Api.Tests/
│   │       ├── Api.Tests.csproj
│   │       ├── Controllers/
│   │       │   └── HealthControllerTests.cs
│   │       ├── Services/
│   │       │   └── README.md
│   │       ├── Repositories/
│   │       │   └── README.md
│   │       ├── Utils/
│   │       │   └── TestDataBuilders.cs
│   │       └── Integration/
│   │           └── CustomWebApplicationFactory.cs
│   ├── Api.sln
│   ├── .editorconfig
│   ├── Directory.Build.props
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoadingSpinner/
│   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   └── index.ts
│   │   │   └── ErrorMessage/
│   │   │       ├── ErrorMessage.tsx
│   │   │       └── index.ts
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── types.ts
│   │   ├── routes/
│   │   │   └── health/
│   │   │       └── HealthPage.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   │   └── favicon.ico
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── package.json
│   ├── .eslintrc.cjs
│   ├── .prettierrc
│   └── README.md
├── legacy/
│   ├── employee-list.asp
│   ├── database-schema.sql
│   └── README.md
├── .github/
│   ├── copilot-instructions.md
│   ├── agents/
│   │   ├── api-builder.agent.md
│   │   ├── test-coverage.agent.md
│   │   └── asp-migrator.agent.md
│   ├── prompts/
│   │   ├── create-api-endpoint.prompt.md
│   │   ├── add-unit-tests.prompt.md
│   │   └── migrate-asp-form.prompt.md
│   └── skills/
│       └── dotnet-api-standards/
│           ├── SKILL.md
│           └── examples/
│               ├── controller-example.cs
│               ├── envelope-dto-example.cs
│               └── repository-example.cs
├── .gitignore
└── README.md
```

---

## Technology Versions

| Technology | Version |
|------------|---------|
| .NET | 8.0 |
| ASP.NET Core | 8.0 |
| Entity Framework Core | 8.0 |
| Swashbuckle.AspNetCore | 6.x |
| xUnit | 2.x |
| Moq | 4.x |
| coverlet.collector | 6.x |
| Node.js | 20+ |
| React | 18.x |
| TypeScript | 5.x |
| Vite | 5.x |
| Tailwind CSS | 3.x |

---

## Backend Implementation Details

### Api.csproj

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <GenerateDocumentationFile>true</GenerateDocumentationFile>
    <NoWarn>$(NoWarn);1591</NoWarn>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.InMemory" Version="8.0.0" />
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
  </ItemGroup>
</Project>
```

### Program.cs

Must include:
- Swagger/OpenAPI configuration with XML comments
- CORS configuration allowing frontend origin
- TransactionIdMiddleware registration
- ServiceCollectionExtensions.AddApplicationServices() call

### HealthController.cs

- Route: `v1/health` (NO `/api/` prefix)
- Single GET endpoint returning `ItemResponseDto<HealthResponseDto>`
- Include XML documentation
- Use `CancellationToken` parameter

### Envelope DTOs

Create in `DTOs/Common/`:
- `ItemResponseDto<T>` with `item`, `metadata`, `links` properties
- `CollectionResponseDto<T>` with `items`, `metadata`, `links` properties  
- `MetadataDto` with `timestamp`, `transactionId`, `totalCount` properties
- `LinksDto` with `self`, `next`, `prev` properties
- `ErrorResponseDto` with `code`, `message`, `details` properties

ALL properties must have:
- `[JsonPropertyName("camelCase")]` attribute
- XML documentation comments

### TransactionIdMiddleware.cs

- Generate GUID for each request
- Add `X-Transaction-Id` response header
- Store in HttpContext.Items for logging

### Api.Tests.csproj

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <IsPackable>false</IsPackable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.Mvc.Testing" Version="8.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.InMemory" Version="8.0.0" />
    <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.8.0" />
    <PackageReference Include="Moq" Version="4.20.70" />
    <PackageReference Include="xunit" Version="2.6.2" />
    <PackageReference Include="xunit.runner.visualstudio" Version="2.5.4" />
    <PackageReference Include="coverlet.collector" Version="6.0.0" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\..\src\Api\Api.csproj" />
  </ItemGroup>
</Project>
```

### HealthControllerTests.cs

- Test naming: `{MethodName}_{Scenario}_{ExpectedResult}`
- Use AAA pattern with `// Arrange`, `// Act`, `// Assert` comments
- Use `#region` blocks to organize tests

### CustomWebApplicationFactory.cs

- Inherit from `WebApplicationFactory<Program>`
- Override `ConfigureWebHost` to replace DbContext with InMemory

### TestDataBuilders.cs

- Static class with factory methods
- Methods have default parameter values for easy test data creation

---

## Frontend Implementation Details

### package.json dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

### index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-brand-header: #87adeb;
  --color-brand-content: #e0f1fa;
  --color-brand-primary: #0066cc;
  --color-brand-text: #333333;
}
```

### lib/types.ts

Define TypeScript interfaces matching backend DTOs:
- `ApiResponse<T>` matching envelope pattern
- `HealthResponse` for health endpoint

### lib/api.ts

- `fetchApi<T>` generic function
- Uses `VITE_API_BASE_URL` environment variable
- Handles errors appropriately

### Components

**LoadingSpinner:** Simple animated spinner using Tailwind

**ErrorMessage:** Displays error with brand styling

**HealthPage:** Calls `/v1/health` endpoint and displays result

---

## Legacy ASP File (for migration demo)

### employee-list.asp

Create a mock Classic ASP file that:
- Uses VBScript
- Reads `Request("department")` parameter
- Contains inline SQL or calls `sp_GetEmployeesByDepartment`
- Renders HTML table with employee data
- Uses Session for state

### database-schema.sql

```sql
CREATE TABLE Employees (
    EmployeeId INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255),
    Department NVARCHAR(50),
    HireDate DATETIME,
    ActiveIndicator BIT DEFAULT 1,
    Salary DECIMAL(10,2)
);

CREATE TABLE Departments (
    DepartmentId INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(50) NOT NULL,
    ManagerId INT
);
```

---

## Copilot Customization Files

### .github/copilot-instructions.md

Copy the complete file from `templates/dotnet-react-starter/copilot-instructions.md`

### agents/api-builder.agent.md

```yaml
---
name: api-builder
description: Creates new API endpoints following organization standards
tools:
  - filesystem
  - terminal
---

You are an API builder agent. When asked to create a new endpoint:

1. Create the DTO in `DTOs/{Feature}/`
2. Create the Repository interface and implementation
3. Create the Service interface and implementation  
4. Create the Controller with proper attributes
5. Register services in ServiceCollectionExtensions
6. Create unit tests for all layers

Always follow the standards in copilot-instructions.md.
```

### agents/test-coverage.agent.md

```yaml
---
name: test-coverage
description: Generates unit tests to achieve 80%+ code coverage
tools:
  - filesystem
  - terminal
---

You are a test coverage agent. When asked to add tests:

1. Analyze existing code for untested paths
2. Create tests following naming convention: `{Method}_{Scenario}_{Expected}`
3. Use AAA pattern with comments
4. Use TestDataBuilders for test data
5. Use InMemory database for repository tests
6. Organize with #region blocks
```

### agents/asp-migrator.agent.md

```yaml
---
name: asp-migrator
description: Migrates Classic ASP pages to .NET 8 + React
tools:
  - filesystem
  - terminal
---

You are an ASP migration agent. When asked to migrate an ASP file:

1. Analyze the ASP file to understand data flow
2. Identify database queries and stored procedures
3. Create equivalent .NET 8 backend (Repository → Service → Controller)
4. Reimplement SP logic in C# LINQ (never call SPs directly)
5. Create React frontend page with brand styling
6. Follow all type mappings in copilot-instructions.md
```

### skills/dotnet-api-standards/SKILL.md

```yaml
---
name: dotnet-api-standards
description: Organization API standards for .NET 8 Web API development
---

# .NET API Standards Skill

This skill provides standards for building APIs in this organization.

## Key Rules

1. Route prefix: `/v1/` (never `/api/`)
2. All responses use envelope pattern
3. Boolean properties end with `Indicator`
4. Pagination uses `offset`/`limit`
5. All async methods have `CancellationToken`

See examples/ folder for reference implementations.
```

---

## Verification Checklist

After building, verify:

- [ ] `dotnet build` succeeds in backend/
- [ ] `dotnet test` passes in backend/
- [ ] `npm install && npm run build` succeeds in frontend/
- [ ] `npm run dev` starts frontend dev server
- [ ] Backend serves Swagger UI at /swagger
- [ ] GET /v1/health returns envelope response
- [ ] Response includes X-Transaction-Id header
- [ ] Frontend loads and shows health status
- [ ] All files follow organization standards
