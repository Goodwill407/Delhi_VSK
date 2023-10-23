import { Component, ElementRef, ViewChild } from '@angular/core';
import * as pbi from 'powerbi-client';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  @ViewChild('embeddedReport1') embeddedReport1!: ElementRef;
  @ViewChild('embeddedReport2') embeddedReport2!: ElementRef;
  @ViewChild('embeddedReport3') embeddedReport3!: ElementRef;
  @ViewChild('embeddedReport4') embeddedReport4!: ElementRef;
  @ViewChild('embeddedReport5') embeddedReport5!: ElementRef;
  @ViewChild('embeddedReport6') embeddedReport6!: ElementRef;
  @ViewChild('embeddedReport7') embeddedReport7!: ElementRef;
  @ViewChild('embeddedReport8') embeddedReport8!: ElementRef;
  @ViewChild('embeddedReport9') embeddedReport9!: ElementRef;
  @ViewChild('embeddedReport10') embeddedReport10!: ElementRef;
  @ViewChild('embeddedReport11') embeddedReport11!: ElementRef;
  @ViewChild('embeddedReport12') embeddedReport12!: ElementRef;
  @ViewChild('embeddedReport13') embeddedReport13!: ElementRef;
  @ViewChild('embeddedReport14') embeddedReport14!: ElementRef;

  reportConfig: any;

  chartOptions: any;
  chartOptions2: any;

  constructor() {

    this.chartOptions = {
      series: [
        {
          name: "serie1",
          data: [44, 55, 41, 64, 22, 43, 21]
        },
        {
          name: "serie2",

          data: [53, 32, 33, 52, 13, 44, 32]
        }
      ],
      chart: {
        type: "bar",
        height: 200
      },
      plotOptions: {
        bar: {
          vertical: true,
          dataLabels: {
            position: "top"
          }
        }
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: "12px",
          colors: ["#fff"]
        }
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["#fff"]
      },
      xaxis: {
        categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007]
      }
    };

    this.chartOptions2 = {
      series: [44, 55, 41, 17, 15],
      chart: {
        height: 300,
        type: "donut"
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        type: "gradient"
      },
      legend: {
        formatter: function (val: any, opts: any) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex];
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  async ngOnInit() {
    this.reportConfig = await fetch('https://playgroundbe-bck-1.azurewebsites.net/Reports/SampleReport');
    this.reportConfig = await this.reportConfig.json();
    this.showReport();
  }

  showReport() {

    let config = {
      type: 'report',
      tokenType: pbi.models.TokenType.Embed,
      accessToken: this.reportConfig.EmbedToken.Token,
      embedUrl: this.reportConfig.EmbedUrl,
      filters: [],
      settings: {
        filterPaneEnabled: true,
        navContentPaneEnabled: true
      }
    };

    let powerbi = new pbi.service.Service(
      pbi.factories.hpmFactory,
      pbi.factories.wpmpFactory,
      pbi.factories.routerFactory
    );
    powerbi.embed(this.embeddedReport1.nativeElement, config);
    powerbi.embed(this.embeddedReport2.nativeElement, config);
    powerbi.embed(this.embeddedReport3.nativeElement, config);
    powerbi.embed(this.embeddedReport4.nativeElement, config);
    powerbi.embed(this.embeddedReport5.nativeElement, config);
    powerbi.embed(this.embeddedReport6.nativeElement, config);
    powerbi.embed(this.embeddedReport7.nativeElement, config);
    powerbi.embed(this.embeddedReport8.nativeElement, config);
    powerbi.embed(this.embeddedReport9.nativeElement, config);
    powerbi.embed(this.embeddedReport10.nativeElement, config);
    powerbi.embed(this.embeddedReport11.nativeElement, config);
    powerbi.embed(this.embeddedReport12.nativeElement, config);
    powerbi.embed(this.embeddedReport13.nativeElement, config);
    powerbi.embed(this.embeddedReport14.nativeElement, config);

  }
}

