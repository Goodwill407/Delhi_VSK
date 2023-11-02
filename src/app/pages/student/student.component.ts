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
  commonHorizontalBarGraph2: any
  EnrollMentBySchoolcategoriesGenderWise: any
  communHorisontal2: any
  maleCounts:any
  femaleCount:any
  otherCount:any

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

    this.commonHorizontalBarGraph =  {
      series: [{
      data: []
    }],
      chart: {
      type: 'bar',
      height: 250
    },
    plotOptions: {
      bar: {
        horizontal: true
      }
    },
    
    dataLabels: {
      enabled: false
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
    }
    
    };

    this.commonHorizontalBarGraph2 = {
      series: [
        {
          name: "Male",
          data: [] 
        },
        {
          name: "Female",
          data: []
        },
        {
          name: "Other",
          data: []
        },
        
      ],
      chart: {
        type: "bar",
        height: 250,
        stacked: true,
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      xaxis: {
        type: "category",
        categories: [
        
        ]
      },
      legend: {
        position: "right",
        offsetY: 40
      },
      fill: {
        opacity: 1
      }
    };
    


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
        const StudentGenderwise = data.genderWiseEnrollmentPerSchCategory

        this.getStudentCatogoryWise(catogoryWiseStudentCount)
        this.getEnrollMentBySchoolcategoriesGenderWise(StudentGenderwise)

      }
    })
  }

  getStudentCatogoryWise(catogoryWiseStudentCount: any) {

    const StudentCount = catogoryWiseStudentCount.map((item: any) => item.studentCount);
    const series = [{
      name: "Total Student",
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
    this.EnrollMentBySchoolcategories.xaxis.categories = [...categories];

  }

  getEnrollMentBySchoolcategoriesGenderWise(StudentGenderwise:any) {
    // const GenderCount = StudentGenderwise.map((item: any) => item.genderCounts);

    this.maleCounts = StudentGenderwise.map((item:any) => {
      const maleEntry = item.genderCounts.find((entry:any) => entry._id === 'M');
      return maleEntry ? maleEntry.studentCount : 0;
    });

    this.femaleCount = StudentGenderwise.map((item:any) => {
      const maleEntry = item.genderCounts.find((entry:any) => entry._id === 'F');
      return maleEntry ? maleEntry.studentCount : 0;
    });

    this.otherCount = StudentGenderwise.map((item:any) => {
      const maleEntry = item.genderCounts.find((entry:any) => entry._id === 'T');
      return maleEntry ? maleEntry.studentCount : 0;
    });

    const series = [
      {
      name: "Male",
      data: this.maleCounts
    },
    {
      name: "Female",
      data: this.femaleCount
    },
    {
      name: "Other",
      data: this.otherCount
    }
  ];
    // const categories = [
      
    // ]

    this.EnrollMentBySchoolcategoriesGenderWise = JSON.parse(JSON.stringify(this.commonHorizontalBarGraph2));
    this.EnrollMentBySchoolcategoriesGenderWise.series = [...series];
    this.EnrollMentBySchoolcategoriesGenderWise.xaxis.title.text = "Students Gender";
    this.EnrollMentBySchoolcategoriesGenderWise.yaxis.title.text = "Total Students";
    // this.EnrollMentBySchoolcategoriesGenderWise.xaxis.categories = [...categories];

  }


    
















}
