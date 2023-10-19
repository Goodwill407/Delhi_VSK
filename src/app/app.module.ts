import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoryService, ChartModule, LineSeriesService } from '@syncfusion/ej2-angular-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PagesModule } from './pages/pages.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartModule,
    PagesModule
  ],
  providers: [LineSeriesService, CategoryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
