import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchoolComponent } from './school/school.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ShowGraphComponent } from './show-graph/show-graph.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { NorthDelhiComponent } from './north-delhi/north-delhi.component';
import { EastDelhiComponent } from './east-delhi/east-delhi.component';
import { NorthEastDelhiComponent } from './north-east-delhi/north-east-delhi.component';
import { SouthDelhiComponent } from './south-delhi/south-delhi.component';
import { NorthWestDelhiComponent } from './north-west-delhi/north-west-delhi.component';
import { WestDelhiComponent } from './west-delhi/west-delhi.component';
import { NewDelhiComponent } from './new-delhi/new-delhi.component';
import { SouthWestDelhiComponent } from './south-west-delhi/south-west-delhi.component';
import { SouthEastDelhiComponent } from './south-east-delhi/south-east-delhi.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'school', component: SchoolComponent },
  { path: 'show-graph', component: ShowGraphComponent },
  { path: 'attendance', component: AttendanceComponent },
  { path: 'north-delhi', component: NorthDelhiComponent },
  { path: 'east-delhi', component: EastDelhiComponent },
  { path: 'north-east-delhi', component: NorthEastDelhiComponent },
  { path: 'south-delhi', component: SouthDelhiComponent },
  { path: 'north-west-delhi', component: NorthWestDelhiComponent },
  { path: 'west-delhi', component: WestDelhiComponent },
  { path: 'new-delhi', component: NewDelhiComponent },
  { path: 'south-west-delhi', component: SouthWestDelhiComponent },
  { path: 'south-east-delhi', component: SouthEastDelhiComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
