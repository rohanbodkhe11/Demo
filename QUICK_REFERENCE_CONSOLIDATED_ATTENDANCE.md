# Quick Reference: Consolidated Attendance Download

## 🎯 What It Does
Download multiple attendance sessions for one course into a single Excel file with lectures numbered 1, 2, 3, etc.

## 📍 Location
**Reports Page** → Faculty section (top of page)

## 🚀 How to Use (3 Steps)

### Step 1: Go to Reports
```
Dashboard → Reports
```

### Step 2: Select Course
```
Dropdown: Choose your course
Example: "DSA (bdc2) - 4 lectures"
```

### Step 3: Download
```
Click: "Download All Lectures" button
Result: Excel file downloads
```

## 📊 Excel File Structure

| Column | Content | Example |
|--------|---------|---------|
| A | Roll Number | 11 |
| B | Student Name | rohan bodkhe |
| C | Department | ECE |
| D | Class | SY ECE A |
| E | Lecture 1 (13/11) | Present |
| F | Lecture 2 (13/11) | Absent |
| G | Lecture 3 (14/11) | Present |
| ... | ... | ... |

## ⚙️ Key Features

- ✅ **Sequential Numbering**: Lecture 1, 2, 3...
- ✅ **Date Included**: Each column shows date (DD/MM)
- ✅ **All Students**: Everyone from all lectures
- ✅ **Auto File Name**: `Consolidated-Attendance-CODE-DATE.xlsx`
- ✅ **One Click**: All data compiled automatically

## 📝 File Example

**Filename**: `Consolidated-Attendance-bdc2-20251114.xlsx`

**Contains**:
- All students from all lectures
- Attendance status: "Present" or "Absent"
- Department and class information
- Professional Excel format

## ⏱️ When to Use

✅ **Good For:**
- Downloading all lectures at once
- Sharing with department
- Creating records
- Analyzing attendance patterns
- Printing for documents

❌ **Not Good For:**
- Downloading individual lectures (use individual reports instead)
- Real-time attendance updates

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Button disabled | Select a course first |
| No file downloads | Check browser download settings |
| Wrong lecture order | Lectures sort by date automatically |
| Missing student | Student only appears if in a lecture |

## 💾 File Details

- **Format**: Excel (.xlsx)
- **Sheets**: 1 (named "Attendance")
- **Headers**: Roll No., Student Name, Department, Class, Lecture columns
- **Data**: One row per student

## 🎓 Example Workflow

```
Lecture 1 (Nov 13) → Mark attendance → Save (Report 1)
Lecture 2 (Nov 13) → Mark attendance → Save (Report 2)
Lecture 3 (Nov 13) → Mark attendance → Save (Report 3)
Lecture 4 (Nov 13) → Mark attendance → Save (Report 4)
                    ↓
            Go to Reports page
                    ↓
            Select DSA course
                    ↓
            Click Download
                    ↓
            Get: Consolidated-Attendance-bdc2-20251114.xlsx
                    ↓
            Contains all 4 lectures as columns!
```

## 🎯 Key Points

1. **One File**: All lectures in one file (not separate files)
2. **Numbered**: Each lecture has a number (Lecture 1, Lecture 2)
3. **Dated**: Each column shows the date (13/11, 14/11)
4. **Complete**: All students and all details included
5. **Professional**: Ready to share or print

## 📋 Lecture Column Format

```
Lecture 1 (13/11) → First lecture marked on Nov 13
Lecture 2 (13/11) → Second lecture marked on Nov 13
Lecture 3 (14/11) → Third lecture marked on Nov 14
...
```

## 🚨 Important Notes

- ✅ Works for any number of lectures
- ✅ Works for any course
- ✅ Works for any class
- ✅ Automatic - no manual work needed
- ✅ One-click download

## 📞 Need Help?

See full documentation:
- **User Guide**: `CONSOLIDATED_ATTENDANCE_GUIDE.md`
- **Technical Details**: `CONSOLIDATED_ATTENDANCE_IMPLEMENTATION.md`
- **Verification Report**: `FEATURE_VERIFICATION_CONSOLIDATED_ATTENDANCE.md`

---

**Last Updated**: November 14, 2025
**Status**: ✅ Ready to Use
