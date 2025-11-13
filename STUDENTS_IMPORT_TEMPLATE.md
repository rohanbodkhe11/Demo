# Student Import Template

This template shows the exact format required for importing students into AttendEase.

## Instructions

1. Create a new Excel file (.xlsx)
2. Add headers in Row 1:
   - Column A: `rollNumber`
   - Column B: `name`
3. Add student data starting from Row 2
4. Save the file
5. Use the "Import Students" button in the Attendance page

## Template Format

### Column Headers (Required - Case Sensitive)

| rollNumber | name |
|-----------|------|

### Example Data

| rollNumber | name |
|-----------|------|
| 001 | Alice Johnson |
| 002 | Bob Williams |
| 003 | Charlie Brown |
| 004 | Diana Prince |
| 005 | Ethan Hunt |
| 006 | Fiona Green |
| 007 | George Miller |
| 008 | Hannah Lee |
| 009 | Isaac Newton |
| 010 | Julia Roberts |

## Important Notes

### rollNumber Column
- Can be numeric or alphanumeric
- Should be unique per class
- Examples: `101`, `S001`, `CS-2024-001`, `1001`
- **Cannot be empty**

### name Column
- First name and/or Last name
- Can contain spaces
- Examples: `John Smith`, `Alice Johnson`, `Bob Williams`
- **Cannot be empty**

### Do NOT Include
- ❌ Email addresses (auto-generated)
- ❌ Password (auto-set to `password123`)
- ❌ Role (auto-set to `student`)
- ❌ Department (auto-set to `Imported`)
- ❌ IDs (auto-generated)

## Example Excel Layout

```
A         | B
----------|------------------
rollNumber| name
----------|------------------
001       | Alice Johnson
002       | Bob Williams
003       | Charlie Brown
004       | Diana Prince
005       | Ethan Hunt
```

## Creating the File in Excel

1. Open Microsoft Excel or Google Sheets
2. Type `rollNumber` in cell A1
3. Type `name` in cell B1
4. Enter student roll numbers in column A (starting A2)
5. Enter student names in column B (starting B2)
6. Save as `.xlsx` format (Excel Workbook)

## Creating the File in Google Sheets

1. Go to sheets.google.com
2. Create new spreadsheet
3. Type headers and data as shown above
4. File → Download → Microsoft Excel (.xlsx)

## Common Mistakes to Avoid

❌ **Mistake 1**: Misspelled column headers
- Wrong: `roll_number`, `Roll Number`, `ROLLNUMBER`
- Right: `rollNumber`

❌ **Mistake 2**: Missing column headers
- Always include row 1 with: `rollNumber` and `name`

❌ **Mistake 3**: Empty cells
- Fill all cells - no empty rows or columns

❌ **Mistake 4**: Extra columns
- Only include: `rollNumber` and `name`
- Remove any other columns (email, password, etc.)

❌ **Mistake 5**: Duplicate roll numbers
- Each student must have a unique roll number in the same class

## Tips for Large Imports

- **Organize**: Use consistent naming format (e.g., "John Doe" vs "john doe")
- **Validate**: Check for duplicates before importing
- **Backup**: Keep original Excel file
- **Batch**: Import 50-100 students at a time

## After Import

1. System creates accounts for each student
2. Auto-generated email: `firstname.lastname@student@example.com` (format varies)
3. Default password: `password123`
4. Students can log in and change password
5. Students automatically added to the selected class

## Support Files

- See `IMPORT_STUDENTS_GUIDE.md` for step-by-step instructions
- See `IMPORT_STUDENTS_STATUS.md` for technical details
