import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { SchoolComponent } from './school/school.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { StudentComponent } from './student/student.component';
import { TeacherComponent } from './teacher/teacher.component';
import { NcertComponent } from './ncert/ncert.component';
import { CQubeComponent } from './c-qube/c-qube.component';
import { AttendanceComponent } from './attendance/attendance.component';


@NgModule({
  declarations: [
    SchoolComponent,
    DashboardComponent,
    StudentComponent,
    TeacherComponent,
    NcertComponent,
    CQubeComponent,
    AttendanceComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    NgxSpinnerModule
  ],
  providers:[DatePipe]
})
export class PagesModule { }
