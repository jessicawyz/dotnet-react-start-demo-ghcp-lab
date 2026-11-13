-- Organization HR Database Schema
-- For migration demonstration purposes
-- Original creation: 2005-03-15

-- Employee master table
CREATE TABLE Employees (
    EmployeeId INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255),
    Department NVARCHAR(50),
    HireDate DATETIME,
    ActiveIndicator BIT DEFAULT 1,
    Salary DECIMAL(10,2),
    CreatedDate DATETIME DEFAULT GETDATE(),
    ModifiedDate DATETIME DEFAULT GETDATE()
);

-- Department reference table
CREATE TABLE Departments (
    DepartmentId INT PRIMARY KEY IDENTITY(1,1),
    DepartmentCode NVARCHAR(10) NOT NULL UNIQUE,
    Name NVARCHAR(50) NOT NULL,
    ManagerId INT NULL,
    BudgetAmount DECIMAL(15,2),
    ActiveIndicator BIT DEFAULT 1,
    CONSTRAINT FK_Departments_Manager FOREIGN KEY (ManagerId) REFERENCES Employees(EmployeeId)
);

-- Legacy stored procedure used by ASP page
-- NOTE: Modern implementation should use LINQ in C# repository layer
CREATE PROCEDURE sp_GetEmployeesByDepartment
    @DeptCode NVARCHAR(10) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        e.EmployeeId,
        e.Name,
        e.Email,
        e.Department,
        e.HireDate,
        e.Salary,
        e.ActiveIndicator
    FROM Employees e
    WHERE (@DeptCode IS NULL OR e.Department = @DeptCode)
    ORDER BY e.Name ASC;
END;
GO

-- Sample seed data for testing
INSERT INTO Departments (DepartmentCode, Name, BudgetAmount) VALUES
    ('ENG', 'Engineering', 500000.00),
    ('SAL', 'Sales', 350000.00),
    ('MKT', 'Marketing', 250000.00),
    ('HRS', 'Human Resources', 150000.00);

INSERT INTO Employees (Name, Email, Department, HireDate, ActiveIndicator, Salary) VALUES
    ('Alice Johnson', 'alice.johnson@org.com', 'ENG', '2020-01-15', 1, 95000.00),
    ('Bob Martinez', 'bob.martinez@org.com', 'ENG', '2019-06-20', 1, 102000.00),
    ('Carol Williams', 'carol.williams@org.com', 'SAL', '2021-03-10', 1, 78000.00),
    ('David Chen', 'david.chen@org.com', 'MKT', '2018-11-05', 1, 85000.00),
    ('Eva Thompson', 'eva.thompson@org.com', 'HRS', '2017-08-22', 1, 72000.00),
    ('Frank Garcia', 'frank.garcia@org.com', 'ENG', '2022-02-14', 0, 88000.00);
