import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchoolDashboardComponent } from './school-dashboard/school-dashboard.component';
import { StudentsComponent } from './students/students.component';
import { StaffComponent } from './staff/staff.component';
import { StudentsAttendanceComponent } from './students-attendance/students-attendance.component';
import { TeacherAttendanceComponent } from './teacher-attendance/teacher-attendance.component';
import { ExamReportComponent } from './exam-report/exam-report.component';
import { AttendanceReportComponent } from './attendance-report/attendance-report.component';

const routes: Routes = [
  { path: 'school-dashboard', component: SchoolDashboardComponent },
  { path: 'students', component: StudentsComponent },
  { path: 'staff', component: StaffComponent },
  { path: 'students-attendance', component: StudentsAttendanceComponent },
  { path: 'teacher-attendance', component: TeacherAttendanceComponent },
  { path: 'exam-report', component: ExamReportComponent },
  { path: 'attendance-report', component: AttendanceReportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolRoutingModule { }
