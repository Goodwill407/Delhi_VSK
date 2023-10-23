import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { SchoolComponent } from './school/school.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ShowGraphComponent } from './show-graph/show-graph.component';


@NgModule({
  declarations: [
    SchoolComponent,
    DashboardComponent,
    ShowGraphComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    NgApexchartsModule
  ]
})
export class PagesModule { }
