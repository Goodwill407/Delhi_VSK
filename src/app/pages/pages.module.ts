import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { SchoolComponent } from './school/school.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ShowGraphComponent } from './show-graph/show-graph.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { HttpClientModule } from '@angular/common/http';
import { NorthDelhiComponent } from './north-delhi/north-delhi.component';
import { EastDelhiComponent } from './east-delhi/east-delhi.component';
import { NorthEastDelhiComponent } from './north-east-delhi/north-east-delhi.component';
import { SouthDelhiComponent } from './south-delhi/south-delhi.component';
import { NorthWestDelhiComponent } from './north-west-delhi/north-west-delhi.component';
import { WestDelhiComponent } from './west-delhi/west-delhi.component';
import { NewDelhiComponent } from './new-delhi/new-delhi.component';
import { SouthWestDelhiComponent } from './south-west-delhi/south-west-delhi.component';
import { SouthEastDelhiComponent } from './south-east-delhi/south-east-delhi.component';


@NgModule({
  declarations: [
    SchoolComponent,
    DashboardComponent,
    ShowGraphComponent,
    AttendanceComponent,
    NorthDelhiComponent,
    EastDelhiComponent,
    NorthEastDelhiComponent,
    SouthDelhiComponent,
    NorthWestDelhiComponent,
    WestDelhiComponent,
    NewDelhiComponent,
    SouthWestDelhiComponent,
    SouthEastDelhiComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    HttpClientModule,
    NgApexchartsModule
  ]
})
export class PagesModule { }
