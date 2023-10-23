import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchoolComponent } from './school/school.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ShowGraphComponent } from './show-graph/show-graph.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'school', component: SchoolComponent },
  { path: 'show-graph', component: ShowGraphComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
