import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolRoutingModule } from './school-routing.module';
import { SchoolDashboardComponent } from './school-dashboard/school-dashboard.component';
import { StudentsComponent } from './students/students.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StaffComponent } from './staff/staff.component';
import { StudentsAttendanceComponent } from './students-attendance/students-attendance.component';
import { TeacherAttendanceComponent } from './teacher-attendance/teacher-attendance.component';
import { ExamReportComponent } from './exam-report/exam-report.component';
import { AttendanceReportComponent } from './attendance-report/attendance-report.component';
import { NgApexchartsModule } from 'ng-apexcharts';


@NgModule({
  declarations: [
    SchoolDashboardComponent,
    StudentsComponent,
    StaffComponent,
    StudentsAttendanceComponent,
    TeacherAttendanceComponent,
    ExamReportComponent,
    AttendanceReportComponent,
  ],
  imports: [
    CommonModule,
    SchoolRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule
  ]
})
export class SchoolModule { }
