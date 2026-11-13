---
name: migrate-asp-form
description: Migrates Classic ASP pages to modern .NET 8 + React architecture
---

# Migrate ASP Form

Convert a Classic ASP page to modern .NET 8 backend with React frontend.

## Input Required

- ASP file path or content
- Target resource name
- Database schema (if available)

## Migration Process

### Step 1: Analyze ASP File
- Identify data sources (SQL queries, stored procedures)
- Map VBScript variables to C# types
- Document session/state usage
- Note security vulnerabilities to fix

### Step 2: Create Backend

**Entity** (in `Domain/`)
```csharp
// Map database columns using type reference:
// SMALLINT → short, INT → int, BIGINT → long
// VARCHAR → string?, DATETIME → DateTime?
// BIT → bool, DECIMAL → decimal
```

**Repository**
- Replace SP calls with LINQ queries
- NEVER call stored procedures directly
- Use AsNoTracking() for reads

**Service**
- Implement business logic in C#
- Return envelope-wrapped responses

**Controller**
- Route: v1/{resource} (no /api/)
- Full XML documentation

### Step 3: Create Frontend

**React Component**
- Fetch data using lib/api.ts
- Display with Tailwind CSS
- Use brand color variables
- Handle loading/error states

### Step 4: Verification

- [ ] No stored procedure calls
- [ ] SQL injection vulnerabilities fixed
- [ ] Session state replaced with proper auth
- [ ] All responses use envelope pattern
- [ ] Frontend uses brand styling
- [ ] Tests added for all layers
