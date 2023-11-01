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
  commonHorizontalBarGraph: any;
  studentsGenderRatio: any
  averageStudentOfSchool: any
  teacherStudentRatio: any
  EnrollMentBySchoolcategories: any
  catogoryWiseStudentCount: any
  commonHorizontalBarGraph2:any


  chartOption: any



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

    this.commonHorizontalBarGraph = {
      series: [
        {
          name: 'basic',
          data: [],
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
      },
      colors: [
        '#d4526e',
        '#13d8aa',
        '#A5978B',
        '#2b908f',
        '#f9a3a4',
        '#90ee7e',
        '#f48024',
        '#69d2e7',
      ],
      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true,
        },
      },
      dataLabels: {
        enabled: true,
      },
      xaxis: {
        categories: [
          'Sarvodaya Sr. Secondary Schools',
      'Sarvodaya Middle Schools',
      'Virtual School',
      'School of Specialized Excellence(SOSE)',
      'Secondary Schools',
      'Sarvodaya Secondary Schools',
      'Primary',
      'Partibha Vikas Vidhyalya',
      'Middle Schools',
        ],
      },
    };

  //   this.commonHorizontalBarGraph2={
  //     series: [{
  //     name: 'Male',
  //     data: [44, 55, 41, 67, 22, 43]
  //   }, {
  //     name: 'Female',
  //     data: [13, 23, 20, 8, 13, 27]
  //   }, {
  //     name: 'Transgender',
  //     data: [11, 17, 15, 15, 21, 14]
  //   }],
  //     chart: {
  //     type: 'bar',
  //     height: 250,
  //     stacked: true,
  //     toolbar: {
  //       show: true
  //     },
  //     zoom: {
  //       enabled: true
  //     }
  //   },
  //   responsive: [{
  //     breakpoint: 480,
  //     options: {
  //       legend: {
  //         position: 'bottom',
  //         offsetX: -10,
  //         offsetY: 0
  //       }
  //     }
  //   }],
  //   plotOptions: {
  //     bar: {
  //       horizontal: false,
  //       borderRadius: 10,
  //       dataLabels: {
  //         total: {
  //           enabled: true,
  //           style: {
  //             fontSize: '13px',
  //             fontWeight: 900
  //           }
  //         }
  //       }
  //     },
  //   },
  //   xaxis: {
  //     type: 'datetime',
  //     categories: ['01/01/2011 GMT', '01/02/2011 GMT', '01/03/2011 GMT', '01/04/2011 GMT',
  //       '01/05/2011 GMT', '01/06/2011 GMT'
  //     ],
  //   },
  //   legend: {
  //     position: 'right',
  //     offsetY: 40
  //   },
  //   fill: {
  //     opacity: 1
  //   }
  //   };
  }

  ngOnInit() {
    this.getAllData()
    this.getEnrollmentBySchoolCatogory()


  }

  getAllData() {
    this.httpService.get('graphs').subscribe((data: any) => {
      if (data) {
        this.totalStudent = data.totalStudents;
        this.totalBoys = data.totalBoys
        this.totalGirls = data.totalGirls
        this.averageStudentOfSchool = data.averageStudentOfSchool
        this.teacherStudentRatio = data.teacherStudentRatio

        const persentage = this.totalStudent / 100

        const studentsGender = {
          totalBoys: data.totalBoys / persentage,
          totalGirls: data.totalGirls / persentage
        }
        this.getStudentsGenderRatio(studentsGender);

      }
    })
  }


  getStudentsGenderRatio(studentsGender: any) {
    const series = [{
      name: "Ratio",
      data: [studentsGender.totalBoys.toFixed(2), studentsGender.totalGirls.toFixed(2)]
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

  getEnrollmentBySchoolCatogory() {
    this.httpService.get('graphs/student-enrollment').subscribe((data: any) => {
      if (data) {
        const catogoryWiseStudentCount = data.enrollmentBySchoolCatogory
        // this.genderWiseEnrollmentPerSchCategory=data.genderWiseEnrollmentPerSchCategory

        this.getStudentCatogoryWise(catogoryWiseStudentCount)





      }
    })
  }

  getStudentCatogoryWise(catogoryWiseStudentCount: any) {

    const StudentCount = catogoryWiseStudentCount.map((item: any) => item.studentCount);
    const series = [{
      name: "Ratio",
      data: StudentCount
    }];
    const categories = [
      'Sarvodaya Sr. Secondary Schools',
      'Sarvodaya Middle Schools',
      'Virtual School',
      'School of Specialized Excellence(SOSE)',
      'Secondary Schools',
      'Sarvodaya Secondary Schools',
      'Primary',
      'Partibha Vikas Vidhyalya',
      'Middle Schools',
    ]

    this.EnrollMentBySchoolcategories = JSON.parse(JSON.stringify(this.commonHorizontalBarGraph));
    this.EnrollMentBySchoolcategories.series = [...series];
    this.EnrollMentBySchoolcategories.xaxis.title.text = "Students Gender";
    this.EnrollMentBySchoolcategories.yaxis.title.text = "Total Students";
    this.EnrollMentBySchoolcategories.xaxis.categories = [...categories];

  }

}






