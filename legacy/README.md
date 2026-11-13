# Legacy ASP Files

This directory contains Classic ASP files from the legacy system.

**Purpose:** Demonstrate migration from Classic ASP to modern .NET 8 + React stack.

## Files

- `employee-list.asp` - Employee directory page with department filtering
- `database-schema.sql` - Database schema and stored procedures

## Migration Notes

When migrating these files:

1. Replace stored procedure calls with C# LINQ in repository layer
2. Use Entity Framework Core for data access
3. Implement proper parameterized queries (original has SQL injection vulnerability)
4. Convert VBScript session state to proper authentication/state management
5. Replace inline HTML with React components using Tailwind CSS
6. Follow envelope response pattern for all API endpoints

## Security Concerns in Legacy Code

- SQL injection vulnerability in department filter
- No input validation
- Session-based state management
- No CSRF protection
