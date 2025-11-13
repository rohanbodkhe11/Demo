# Import Students Guide

## How to Import Students into AttendEase

### Prerequisites
- You must be logged in as a faculty member
- You must have created at least one course
- You need an Excel file (.xlsx or .xls) with student data

### Excel File Format

The Excel file must have **exactly** these two columns:

| rollNumber | name |
|-----------|------|
| 101 | Alice Johnson |
| 102 | Bob Williams |
| 103 | Charlie Brown |

### Step-by-Step Instructions

1. **Navigate to Attendance Page**
   - Click "Mark Attendance" in the sidebar or navigation menu

2. **Select a Course**
   - Choose between "Theory" or "Practical" courses
   - Select a class from the dropdown

3. **Import Students**
   - Click the "Import Students" button
   - Select your Excel file (.xlsx or .xls format)
   - Click "Import"

4. **Verify Import**
   - The system will show how many students were added
   - Students that already exist (by roll number) will be skipped
   - The student list will refresh automatically

### What Happens During Import

- Students are added to the system with the selected class
- Each student gets a default password: `password123`
- Email is auto-generated from name and roll number
- Students are saved to the database permanently
- Duplicate roll numbers are automatically skipped

### Troubleshooting

**Error: "The Excel file must have 'rollNumber' and 'name' columns"**
- Ensure your Excel file has exactly these column names
- Column names are case-sensitive
- Check for typos in column headers

**Import completed but no students appear**
- Refresh the page (F5)
- Students might have been skipped due to duplicates
- Check the "added" and "skipped" counts in the success message

**Students disappear after refresh**
- This should not happen - students are saved to db.json
- Check your browser console for errors
- Restart the dev server

### Example Excel File

You can create a simple Excel file with:

**Column A: rollNumber**
- 101
- 102
- 103
- 104

**Column B: name**
- Alice Johnson
- Bob Williams
- Charlie Brown
- Diana Prince

Save as `.xlsx` and import!

### After Importing Students

1. Navigate to the attendance marking interface
2. Select the class where you imported students
3. Students will appear in the attendance sheet
4. Mark attendance by clicking present/absent buttons
5. Fill in the lecture date and time slot
6. Click "Submit Attendance" to save

### Data Persistence

- All imported students are saved to `data/db.json`
- Attendance records are also saved to `data/db.json`
- Data persists across server restarts
