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
import { NishthaComponent } from './nishtha/nishtha.component';
import { PgiComponent } from './pgi/pgi.component';
import { UdiseComponent } from './udise/udise.component';
import { UdiseDataComponent } from './udise-data/udise-data.component';
import { UdiseSchoolComponent } from './udise-school/udise-school.component';
import { NasComponent } from './nas/nas.component';
import { DikshaComponent } from './diksha/diksha.component';
import { AttendanceRangeWiseComponent } from './attendance-range-wise/attendance-range-wise.component';
import { AttendanceRegularComponent } from './attendance-regular/attendance-regular.component';
import { SearchPipe } from '../pipes/search.pipe';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { TeacherGuestComponent } from './teacher-guest/teacher-guest.component';
import { TabularComponent } from './attendance/tabular/tabular.component';
import { GeographicalComponent } from './attendance/geographical/geographical.component';
import { TabularSchoolComponent } from './school/tabular-school/tabular-school.component';
import { BirdEyeSchoolComponent } from './school/bird-eye-school/bird-eye-school.component';

@NgModule({
  declarations: [
    SchoolComponent,
    DashboardComponent,
    StudentComponent,
    TeacherComponent,
    NcertComponent,
    CQubeComponent,
    AttendanceComponent,
    NishthaComponent,
    PgiComponent,
    UdiseComponent,
    UdiseDataComponent,
    UdiseSchoolComponent,
    NasComponent,
    DikshaComponent,
    AttendanceRangeWiseComponent,
    AttendanceRegularComponent,
    SearchPipe,
    TeacherGuestComponent,
    TabularComponent,
    GeographicalComponent,
    TabularSchoolComponent,
    BirdEyeSchoolComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    NgxSpinnerModule,
    PDFExportModule
  ],
  providers: [DatePipe]
})
export class PagesModule { }
