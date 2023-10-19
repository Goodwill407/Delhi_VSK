import { Component } from '@angular/core';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent {

  chartOptions: any;
  chartOptions2: any;
  chartOptions3: any;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Website Blog",
          type: "column",
          data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
        },
        {
          name: "Social Media",
          type: "line",
          data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
        }
      ],
      chart: {
        height: 340,
        type: "line"
      },
      stroke: {
        width: [0, 4]
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1]
      },
      labels: [
        "01 Jan 2001",
        "02 Jan 2001",
        "03 Jan 2001",
        "04 Jan 2001",
        "05 Jan 2001",
        "06 Jan 2001",
        "07 Jan 2001",
        "08 Jan 2001",
        "09 Jan 2001",
        "10 Jan 2001",
        "11 Jan 2001",
        "12 Jan 2001"
      ],
      xaxis: {
        type: "datetime"
      },
      yaxis: [
        {
          title: {
            text: "Website Blog"
          }
        },
        {
          opposite: true,
          title: {
            text: "Social Media"
          }
        }
      ]
    };

    this.chartOptions2 = {
      series: [44, 55],
      chart: {
        height: 350,
        type: "donut"
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: false
              },
              value: {
                show: true,
                formatter: (val: any) => {
                  return 'Value ' + val;
                }
              },
              total: {
                show: true,
                showAlways: false,
                formatter: (w: any) => {
                  return 'Total ' + w.globals.seriesTotals.reduce((a: any, b: any) => {
                    return a + b
                  }, 0)
                }
              }
            }
          }
        }
      },
      labels: ['Male', 'Female'],
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

    this.chartOptions3 = {
      series: [44, 55],
      chart: {
        height: 350,
        type: "donut"
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: false
              },
              value: {
                show: true,
                formatter: (val: any) => {
                  return 'Value ' + val;
                }
              },
              total: {
                show: true,
                showAlways: false,
                formatter: (w: any) => {
                  return 'Total ' + w.globals.seriesTotals.reduce((a: any, b: any) => {
                    return a + b
                  }, 0)
                }
              }
            }
          }
        }
      },
      labels: ['Male', 'Female'],
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
