# Quick Reference - Attendance & Dashboard

## 🎯 Main Features Working

### 1. **Mark Attendance**
- Faculty goes to: Mark Attendance
- Selects course and class
- Marks Present/Absent for each student
- Clicks Submit
- ✅ Data saved to database

### 2. **Faculty Dashboard Shows**
```
📊 Total Courses: 2 (1 Theory + 1 Practical)
👥 Total Students: 45
📋 Attendance Reports: 5
```

### 3. **Student Dashboard Shows**
```
📈 Overall Attendance: 85.5%
📚 Courses Enrolled: 3
⚠️ Last Absent: Nov 14, 2025
📊 Subject-wise breakdown
```

---

## 🔄 Complete Workflow

```
Faculty                          Database                        Student
  │                                 │                               │
  ├─ Create Course ─────────────────┤                               │
  │                                 │                               │
  ├─ Import Students ───────────────┤                               │
  │                                 │                               │
  ├─ Mark Attendance ───────────────┤                               │
  │   - Select Present/Absent       │                               │
  │   - Choose Date & Time          │                               │
  │   - Click Submit                │                               │
  │                                 ├─ Save to data/db.json         │
  │                                 │   Attendance Report            │
  │                                 │   + Notifications              │
  │                                 │                               │
  ├─ Dashboard auto-updates ───────┤                               │
  │  - New Report Count (+1)        │                               │
  │  - Stats Refreshed              │                               ├─ Dashboard auto-updates
  │                                 │                               │  - Attendance %
  │                                 │                               │  - Subject-wise data
  │                                 │                               │  - Last Absence
```

---

## 📊 Statistics Calculation

### Faculty Level
- **Total Courses** = Count all courses where facultyId = current user
- **Total Students** = Count all students in the faculty's classes
- **Attendance Reports** = Count all attendance records for faculty's courses

### Student Level
- **Overall Attendance** = (Present Records / Total Records) × 100
- **Subject-wise Attendance** = (Present for Course / Total for Course) × 100
- **Last Absent** = Most recent absence record sorted by date

---

## 🗄️ Database Structure

### Key Collections in data/db.json

```json
{
  "users": [
    { "id": "user-123", "name": "Alice", "role": "student", "class": "SY ECE A" }
  ],
  "courses": [
    { "id": "course-1", "name": "DSA", "facultyId": "faculty1", "type": "Theory" }
  ],
  "attendanceReports": [
    {
      "id": "rep-123",
      "courseId": "course-1",
      "courseName": "DSA",
      "class": "SY ECE A",
      "date": "2025-11-14",
      "timeSlot": "10:00 AM",
      "attendance": [
        { "studentId": "user-123", "isPresent": true }
      ]
    }
  ]
}
```

---

## 🧪 Testing Quick Steps

### Test Attendance Save
```
1. Login: /api/debug/login-as?email=rohan55@gmail.com
2. Go to: Mark Attendance
3. Select: Course and Class
4. Add/Import students
5. Mark attendance
6. Submit
✅ Toast notification should show
✅ Redirect to report page
✅ Check data/db.json - attendance report created
```

### Test Dashboard Update
```
1. After submitting attendance
2. Go to: Dashboard
3. Check numbers updated:
   - Attendance Reports count increased
   - Total Students count accurate
✅ All stats should be current
```

### Test Data Persistence
```
1. Submit attendance
2. Restart server (Ctrl+C, npm run dev)
3. Go to Dashboard
✅ Stats should still show
✅ Data not lost
```

---

## 🔌 API Quick Reference

### Get Dashboard Stats
```bash
GET /api/dashboard/stats?userId=user-123&role=faculty

Response:
{
  "totalCourses": 2,
  "totalStudents": 45,
  "attendanceReports": 5,
  "theoryCourses": 1,
  "practicalCourses": 1
}
```

### Save Attendance
```bash
POST /api/attendance

{
  "report": {
    "id": "rep-123",
    "courseId": "course-1",
    "attendance": [
      { "studentId": "user-123", "isPresent": true }
    ]
  },
  "notifications": [...]
}

Response: 201 Created
```

---

## 📱 User Experience Flow

### Faculty Perspective
```
Login → Dashboard (see stats) → Courses → Mark Attendance 
→ Select Class → View Students → Mark Present/Absent 
→ Submit → Report View → Back to Dashboard 
→ See updated Attendance Reports count
```

### Student Perspective
```
Login → Dashboard → See Attendance % → See Subject-wise breakdown 
→ See Last Absent → Check attendance trends
```

---

## ✅ Verification Commands

Check if attendance report saved:
```bash
# Look in data/db.json for attendanceReports array
node -e "const fs=require('fs'); const db=JSON.parse(fs.readFileSync('data/db.json','utf8')); console.log('Reports:', db.attendanceReports.length); console.log(db.attendanceReports[0]);"
```

Check if stats API working:
```bash
# Replace user-id with actual ID
curl "http://localhost:9002/api/dashboard/stats?userId=user-id&role=faculty"
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Attendance doesn't save | Check browser console, verify POST returns 201 |
| Dashboard shows 0 courses | Verify courses were created with correct facultyId |
| Student attendance shows 0% | Verify attendance reports exist in db.json |
| Numbers don't update | Refresh page (F5), clear cache |
| Server error | Restart: `npm run dev` |

---

## 🎯 Key Improvements Made

✅ **Before**: Attendance marked but not saved  
✅ **After**: All attendance automatically persisted

✅ **Before**: No dashboard statistics  
✅ **After**: Real-time statistics for faculty and students

✅ **Before**: Manual calculation needed  
✅ **After**: API calculates and returns formatted data

✅ **Before**: Data lost on server restart  
✅ **After**: Data persists in db.json

---

## 📊 Live Statistics Available

### For Faculty
- Total courses taught
- Total students across classes
- Number of attendance reports submitted
- Split by Theory/Practical courses

### For Students
- Overall attendance percentage
- Per-subject attendance breakdown
- Course details with attendance counts
- Last absence record with date

---

## 🚀 Next Time You...

**Mark Attendance:**
- It's automatically saved ✅
- Report is generated ✅
- Statistics update ✅

**View Dashboard:**
- See current attendance stats ✅
- See course breakdown ✅
- See student counts ✅

**Restart Server:**
- All data preserved ✅
- Stats still accurate ✅
- No data loss ✅

---

**Status**: ✅ FULLY WORKING - Ready to Use!
