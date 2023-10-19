import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  // chartOptions!: any
  chartOptions: any;
  chartOptions2: any;

  constructor() {
    // this.chartOptions = {
    //   series: [
    //     {
    //       name: "serie1",
    //       data: [44, 55, 41, 64, 22, 43, 21]
    //     },
    //     {
    //       name: "serie2",

    //       data: [53, 32, 33, 52, 13, 44, 32]
    //     }
    //   ],
    //   chart: {
    //     type: "area",
    //     height: 430
    //   },
    //   plotOptions: {
    //     bar: {
    //       vertical: true,
    //       dataLabels: {
    //         position: "top"
    //       }
    //     }
    //   },
    //   dataLabels: {
    //     enabled: true,
    //     offsetX: -6,
    //     style: {
    //       fontSize: "12px",
    //       colors: ["#fff"]
    //     }
    //   },
    //   stroke: {
    //     show: true,
    //     width: 1,
    //     colors: ["#fff"]
    //   },
    //   xaxis: {
    //     categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007]
    //   }
    // };

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
}

