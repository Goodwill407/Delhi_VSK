import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchoolComponent } from './school/school.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentComponent } from './student/student.component';
import { TeacherComponent } from './teacher/teacher.component'
import { NcertComponent } from './ncert/ncert.component';
import { CQubeComponent } from './c-qube/c-qube.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { NishthaComponent } from './nishtha/nishtha.component';
import { PgiComponent } from './pgi/pgi.component';
import { UdiseComponent } from './udise/udise.component';
import { NasComponent } from './nas/nas.component';
import { DikshaComponent } from './diksha/diksha.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'school', component: SchoolComponent },
  { path: 'student', component: StudentComponent },
  { path: 'teacher', component: TeacherComponent },
  { path: 'ncert', component: NcertComponent },
  { path: 'cquib', component: CQubeComponent },
  { path: 'attendance', component: AttendanceComponent },
  { path: 'nishtha', component: NishthaComponent },
  { path: 'pgi', component: PgiComponent },
  { path: 'nas', component: NasComponent },
  { path: 'udise', component: UdiseComponent },
  { path: 'diksha', component: DikshaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
