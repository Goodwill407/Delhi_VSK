import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchoolComponent } from './school/school.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentComponent } from './student/student.component';
import { TeacherComponent } from './teacher/teacher.component'
import { NcertComponent } from './ncert/ncert.component';
import { CQubeComponent } from './c-qube/c-qube.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'school', component: SchoolComponent },
  { path: 'student', component: StudentComponent },
  { path: 'teacher', component: TeacherComponent },
  { path: 'ncert', component: NcertComponent },
  { path: 'cquib', component: CQubeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
