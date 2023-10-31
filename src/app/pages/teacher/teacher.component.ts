import { Component } from '@angular/core';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent { commonBarGraph: any;
  commonPieGraph: any;

  teacherGenderRatio: any;
  studentsGenderRatio: any;
  typesOfSchools: any;
  shiftWiseSchools: any;
  teacherRaio:any;
  totalTeachers: number = 41236;

  constructor() {
    this.commonBarGraph = {
      series: [],
      chart: {
        type: "bar",
        events: {
          click: function (chart: any, w: any, e: any) {
            // console.log(chart, w, e)
          }
        }
      },
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      grid: {
        show: false
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            fontSize: "12px"
          }
        }
      }
    };

    this.commonPieGraph = {
      series: [],
      chart: {
        type: "donut"
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        type: "gradient"
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              showAlways: false,
              formatter: (w: any) => {
                return ' tCO2e'
              }
            }
          }
        }
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
    }
  }

  ngOnInit() {
    this.getStudentsGenderRatio();
    this.getTeachersGenderRatio();
    this.getTypesOfSchools();
    this.getShiftWiseSchools();
    this.getTeacherRatio();
  }

  getStudentsGenderRatio() {
    const series = [{
      name: "Graphical",
      data: [21, 22]
    }];
    const categories = [
      "Mary", "Evans", "David", "Wilson", "Lily", "Roberts", "Julia", "May"
    ]
    this.studentsGenderRatio = this.commonBarGraph;
    this.studentsGenderRatio.series = [...series];
    this.studentsGenderRatio.xaxis.categories = [...categories];
  }

  getTeachersGenderRatio() {
    const series = [{
      name: "Graphical",
      data: [21, 22]
    }];
    const categories = [
      "Mary", "Evans", "David", "Wilson", "Lily", "Roberts", "Julia", "May"
    ]
    this.teacherGenderRatio = this.commonBarGraph;
    this.teacherGenderRatio.series = [...series];
    this.teacherGenderRatio.xaxis.categories = [...categories];
  }

  getTypesOfSchools() {
    const series = [44, 55, 41, 17, 15]
    this.typesOfSchools = this.commonPieGraph;
    this.typesOfSchools.series = [...series];
  }

  getShiftWiseSchools() {
    const series = [{
      name: "Graphical",
      data: [21, 22, 10, 28, 16, 21, 13, 30]
    }];
    const categories = [
      "Mary", "Evans", "David", "Wilson", "Lily", "Roberts", "Julia", "May"
    ]
    this.shiftWiseSchools = this.commonBarGraph;
    this.shiftWiseSchools.series = [...series];
    this.shiftWiseSchools.xaxis.categories = [...categories];
  }

  getTeacherRatio(){
    this.teacherRaio = {
      series: [
      {
        type: 'rangeArea',
        name: 'Team B Range',
    
        data: [
          {
            x: 'Jan',
            y: [1100, 1900]
          },
          {
            x: 'Feb',
            y: [1200, 1800]
          },
          {
            x: 'Mar',
            y: [900, 2900]
          },
          {
            x: 'Apr',
            y: [1400, 2700]
          },
          {
            x: 'May',
            y: [2600, 3900]
          },
          {
            x: 'Jun',
            y: [500, 1700]
          },
          {
            x: 'Jul',
            y: [1900, 2300]
          },
          {
            x: 'Aug',
            y: [1000, 1500]
          }
        ]
      },
    
      {
        type: 'rangeArea',
        name: 'Team A Range',
        data: [
          {
            x: 'Jan',
            y: [3100, 3400]
          },
          {
            x: 'Feb',
            y: [4200, 5200]
          },
          {
            x: 'Mar',
            y: [3900, 4900]
          },
          {
            x: 'Apr',
            y: [3400, 3900]
          },
          {
            x: 'May',
            y: [5100, 5900]
          },
          {
            x: 'Jun',
            y: [5400, 6700]
          },
          {
            x: 'Jul',
            y: [4300, 4600]
          },
          {
            x: 'Aug',
            y: [2100, 2900]
          }
        ]
      },
    
      {
        type: 'line',
        name: 'Team B Median',
        data: [
          {
            x: 'Jan',
            y: 1500
          },
          {
            x: 'Feb',
            y: 1700
          },
          {
            x: 'Mar',
            y: 1900
          },
          {
            x: 'Apr',
            y: 2200
          },
          {
            x: 'May',
            y: 3000
          },
          {
            x: 'Jun',
            y: 1000
          },
          {
            x: 'Jul',
            y: 2100
          },
          {
            x: 'Aug',
            y: 1200
          },
          {
            x: 'Sep',
            y: 1800
          },
          {
            x: 'Oct',
            y: 2000
          }
        ]
      },
      {
        type: 'line',
        name: 'Team A Median',
        data: [
          {
            x: 'Jan',
            y: 3300
          },
          {
            x: 'Feb',
            y: 4900
          },
          {
            x: 'Mar',
            y: 4300
          },
          {
            x: 'Apr',
            y: 3700
          },
          {
            x: 'May',
            y: 5500
          },
          {
            x: 'Jun',
            y: 5900
          },
          {
            x: 'Jul',
            y: 4500
          },
          {
            x: 'Aug',
            y: 2400
          },
          {
            x: 'Sep',
            y: 2100
          },
          {
            x: 'Oct',
            y: 1500
          }
        ]
      }
    ],
      chart: {
      height: 250,
      type: 'rangeArea',
      animations: {
        speed: 500
      }
    },
    colors: ['#d4526e', '#33b2df', '#d4526e', '#33b2df'],
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: [0.24, 0.24, 1, 1]
    },
    forecastDataPoints: {
      count: 2
    },
    stroke: {
      curve: 'straight',
      width: [0, 0, 2, 2]
    },
    legend: {
      show: true,
      customLegendItems: ['Team B', 'Team A'],
      inverseOrder: true
    },
    title: {
      text: 'Range Area with Forecast Line (Combo)'
    },
    markers: {
      hover: {
        sizeOffset: 5
      }
    }
    };
  }

}
