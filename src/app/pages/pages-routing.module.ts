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
import { TeacherAttendanceComponent } from './teacher-attendance/teacher-attendance.component';
import { NipunComponent } from './nipun/nipun.component';
import { MissionBuniyaadComponent } from './mission-buniyaad/mission-buniyaad.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  { path: 'admin-dashboard', component: DashboardComponent },
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
  { path: 'teacher-attendance', component: TeacherAttendanceComponent },
  { path: 'nipun', component: NipunComponent },
  { path: 'mission-buniyaad', component: MissionBuniyaadComponent },
  { path: 'about', component: AboutComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
