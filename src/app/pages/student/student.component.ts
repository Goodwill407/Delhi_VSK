import { Component } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent {
  totalStudent: any;
  totalBoys: any;
  totalGirls: any;
  commonBarGraph: any
  commonPieGraph: any
  studentsGenderRatio: any
  averageStudentOfSchool: any
  teacherStudentRatio: any
  student_info: any
  studentresult: any


  constructor(private httpService: HttpServiceService) {
    this.commonBarGraph = {
      series: [],
      chart: {
        type: "bar",
        events: {
          click: function (chart: any, w: any, e: any) {
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
        title: {
          text: "",
          style: {
            fontSize: "14px",
            color: "#6d7fcc",
            fontWeight: "600"
          }
        }
      },
      yaxis: {
        title: {
          text: "",
          style: {
            fontSize: "14px",
            color: "#6d7fcc",
            fontWeight: "600"
          }
        },
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
              total: {
                show: true,
                formatter: (w: any) => {
                  return w.globals.seriesTotals.reduce((a: any, b: any) => {
                    return a + b
                  }, 0) + ' Schools'
                }
              }
            }
          }
        }
      },
      labels: ['Goods & Services', 'Offices', 'Marketing', 'Employees', 'Travel', 'Other'],
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

  ngOnInit() {
    this.getAllData()
    this.studentInfo()
    this.getStuentResult()
  }

  getAllData() {
    this.httpService.get('graphs').subscribe((data: any) => {
      if (data) {
        this.totalStudent = data.totalStudents;
        this.totalBoys = data.totalBoys
        this.totalGirls = data.totalGirls
        this.averageStudentOfSchool=data.averageStudentOfSchool
        this.teacherStudentRatio=data.teacherStudentRatio

        const studentsGender = {
          totalBoys: data.totalBoys,
          totalGirls: data.totalGirls
        }
        this.getStudentsGenderRatio(studentsGender);

      }
    })
  }


  getStudentsGenderRatio(studentsGender: any) {
    const series = [{
      name: "Graphical",
      data: [studentsGender.totalBoys, studentsGender.totalGirls]
    }];
    const categories = [
      "Boys", "Girls"
    ]
    this.studentsGenderRatio = JSON.parse(JSON.stringify(this.commonBarGraph));
    this.studentsGenderRatio.series = [...series];
    this.studentsGenderRatio.xaxis.title.text = "Students Gender";
    this.studentsGenderRatio.yaxis.title.text = "Total Students";
    this.studentsGenderRatio.xaxis.categories = [...categories];
  }

 
  

  studentInfo() {
    this.student_info = {
      series: [{
        data: [44, 55, 41, 64, 22, 43, 21]
      }, {
        data: [53, 32, 33, 52, 13, 44, 32]
      }],
      chart: {
        type: 'bar',
        height: 250
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: 'top',
          },
        }
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: '12px',
          colors: ['#fff']
        }
      },
      stroke: {
        show: true,
        width: 1,
        colors: ['#fff']
      },
      tooltip: {
        shared: true,
        intersect: false
      },
      xaxis: {
        categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007],
      },
    };
  }

  getStuentResult() {
    this.studentresult = {
      series: [
        {
          name: "series1",
          data: [31, 40, 28, 51, 42, 109, 100]
        },
        {
          name: "series2",
          data: [11, 32, 45, 32, 34, 52, 41]
        }
      ],
      chart: {
        height: 250,
        type: "area"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z"
        ]
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm"
        }
      }
    };
  }

}
