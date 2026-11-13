<%@ Language="VBScript" %>
<%
'*************************************************************
' Organization Legacy Employee Directory
' Original Date: 2005-03-15
' WARNING: This file is for migration demonstration purposes
'*************************************************************

Option Explicit

Dim selectedDepartmentCode
Dim dbConnectionString
Dim recordsetEmployees
Dim sqlQueryText

' Retrieve department filter from query string
selectedDepartmentCode = Request("dept_code")
If selectedDepartmentCode = "" Then
    selectedDepartmentCode = "ALL"
End If

' Store user selection in session for back navigation
Session("LastSelectedDept") = selectedDepartmentCode

' Database connection configuration
dbConnectionString = "Provider=SQLOLEDB;Server=YOUR_SERVER;Database=YOUR_DATABASE;Trusted_Connection=Yes;"

%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <title>Employee Directory - <%= selectedDepartmentCode %></title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .header-banner { background: #336699; color: white; padding: 15px; margin-bottom: 20px; }
        .data-table { border-collapse: collapse; width: 100%; background: white; }
        .data-table th { background: #87adeb; color: white; padding: 10px; text-align: left; }
        .data-table td { border: 1px solid #ddd; padding: 8px; }
        .data-table tr:nth-child(even) { background: #f9f9f9; }
        .filter-form { margin-bottom: 20px; padding: 15px; background: white; border: 1px solid #ddd; }
        .active-badge { background: green; color: white; padding: 2px 8px; border-radius: 3px; }
        .inactive-badge { background: gray; color: white; padding: 2px 8px; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="header-banner">
        <h1>Employee Directory System</h1>
        <p>Department: <%= selectedDepartmentCode %></p>
    </div>

    <div class="filter-form">
        <form method="GET" action="employee-list.asp">
            <label for="dept_code">Filter by Department:</label>
            <select name="dept_code" id="dept_code">
                <option value="ALL">All Departments</option>
                <option value="ENG" <%= IIf(selectedDepartmentCode = "ENG", "selected", "") %>>Engineering</option>
                <option value="SAL" <%= IIf(selectedDepartmentCode = "SAL", "selected", "") %>>Sales</option>
                <option value="MKT" <%= IIf(selectedDepartmentCode = "MKT", "selected", "") %>>Marketing</option>
                <option value="HRS" <%= IIf(selectedDepartmentCode = "HRS", "selected", "") %>>Human Resources</option>
            </select>
            <input type="submit" value="Apply Filter">
        </form>
    </div>

<%
' Build SQL query - WARNING: This pattern is vulnerable to SQL injection
' Modern implementation should use parameterized queries
If selectedDepartmentCode = "ALL" Then
    sqlQueryText = "EXEC sp_GetEmployeesByDepartment @DeptCode = NULL"
Else
    sqlQueryText = "EXEC sp_GetEmployeesByDepartment @DeptCode = '" & selectedDepartmentCode & "'"
End If

Set recordsetEmployees = Server.CreateObject("ADODB.Recordset")
recordsetEmployees.Open sqlQueryText, dbConnectionString

If recordsetEmployees.EOF Then
%>
    <p><em>No employees found for the selected department.</em></p>
<%
Else
%>
    <table class="data-table">
        <thead>
            <tr>
                <th>Employee ID</th>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Department</th>
                <th>Hire Date</th>
                <th>Salary</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
<%
    Do While Not recordsetEmployees.EOF
        Dim employeeStatusBadge
        If recordsetEmployees("ActiveIndicator") = True Then
            employeeStatusBadge = "<span class='active-badge'>Active</span>"
        Else
            employeeStatusBadge = "<span class='inactive-badge'>Inactive</span>"
        End If
%>
            <tr>
                <td><%= recordsetEmployees("EmployeeId") %></td>
                <td><%= Server.HTMLEncode(recordsetEmployees("Name")) %></td>
                <td><%= Server.HTMLEncode(recordsetEmployees("Email")) %></td>
                <td><%= Server.HTMLEncode(recordsetEmployees("Department")) %></td>
                <td><%= FormatDateTime(recordsetEmployees("HireDate"), vbShortDate) %></td>
                <td>$<%= FormatNumber(recordsetEmployees("Salary"), 2) %></td>
                <td><%= employeeStatusBadge %></td>
            </tr>
<%
        recordsetEmployees.MoveNext
    Loop
%>
        </tbody>
    </table>
<%
End If

recordsetEmployees.Close
Set recordsetEmployees = Nothing
%>

    <p style="margin-top: 20px; font-size: 12px; color: #666;">
        Generated: <%= Now() %> | Request ID: <%= Now() %>
    </p>
</body>
</html>

<%
' Helper function for conditional output
Function IIf(condition, trueValue, falseValue)
    If condition Then
        IIf = trueValue
    Else
        IIf = falseValue
    End If
End Function
%>
