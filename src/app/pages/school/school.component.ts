import { Component } from '@angular/core';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent {

  commonBarGraph: any;
  commonPieGraph: any;

  teacherGenderRatio: any;
  studentsGenderRatio: any;
  typesOfSchools: any;
  shiftWiseSchools: any;

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

}
