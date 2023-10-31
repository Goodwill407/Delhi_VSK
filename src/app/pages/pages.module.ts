import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { SchoolComponent } from './school/school.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    SchoolComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    HttpClientModule,
    NgApexchartsModule
  ]
})
export class PagesModule { }
