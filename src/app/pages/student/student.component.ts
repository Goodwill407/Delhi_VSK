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
  commonBarGraph2:any
  commonHorizontalBarGraph: any;
  studentsGenderRatio: any
  averageStudentOfSchool: any
  teacherStudentRatio: any
  EnrollMentBySchoolcategories: any
  catogoryWiseStudentCount: any
  commonHorizontalBarGraph2: any
  EnrollMentBySchoolcategoriesGenderWise: any
  communHorisontal2: any
  commonPollarChart: any
  commonPieDonut:any
  maleCounts: any
  femaleCount: any
  otherCount: any
  StreamWiseStudent:any;
  AffiliationWiseStudent:any
  TypeOfStudSchool:any
  MinorityWiseStudCount:any;
  StudentShiftWiseCounts:any
  StudentManagementWiseCounts:any
  

  chartOptions: any



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


    this.commonHorizontalBarGraph2 = {
      series: [],
      chart: {
        type: "bar",
        height: 250,
        stacked: true,
        stackType: "100%"
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      stroke: {
        width: 1,
        colors: ["#fff"]
      },

      xaxis: {
        categories: []
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val + "K";
          }
        }
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40
      }
    };

    this.commonPollarChart = {
      series: [],
      chart: {
        type: "polarArea",
        height:'300px'
       },
      stroke: {
        colors: ["#fff"]
      },
      fill: {
        opacity: 0.8
      },
      legend: {
        position: "bottom"
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom"
            }
          }
        }
      ],
      labels: []
    };

    this.commonPieDonut = {
      series: [],
      chart: {
        width: 380,
        type: "donut"
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        type: "gradient"
      },
      legend: {
          formatter: function(val:any, opts:any) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex];
        },
        position: "bottom"
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
    
    this.commonBarGraph2 = {
      series: [
        {
          name: "",
          data: []
        }
      ],
      chart: {
        height: 250,
        type: "bar",
        events: {
          click: function(chart:any, w:any, e:any) {
            // console.log(chart, w, e)
          }
        }
      },
      colors: [
        "#008FFB",
        "#00E396",
        "#FEB019",
        "#FF4560",
        "#775DD0",
        "#546E7A",
        "#26a69a",
        "#D10CE8"
      ],
      plotOptions: {
        bar: {
          columnWidth: "50%",
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
        show: true
      },
      
        labels:[]
      
    };





  }

  ngOnInit() {
    this.getAllData()
    this.getEnrollmentBySchoolCatogory()
    this.getStreanWiseCount()

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
      name: ["Female"],
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
    const SchCategory = catogoryWiseStudentCount.map((item: any) => item.SchCategory);
    this.chartOptions = {
      series: [
        {
          name: "basic",
          data: StudentCount
        }
      ],
      chart: {
        type: "bar",
        height: 250
      },
      color: ["#546E7A"],


      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: SchCategory
      }
    };

  }

  getEnrollMentBySchoolcategoriesGenderWise(StudentGenderwise: any) {
    // const GenderCount = StudentGenderwise.map((item: any) => item.genderCounts);
    const SchCategory = StudentGenderwise.map((item: any) => item.SchCategory);

    this.maleCounts = StudentGenderwise.map((item: any) => {
      const maleEntry = item.genderCounts.find((entry: any) => entry._id === 'M');
      return maleEntry ? maleEntry.studentCount : 0;
    });

    this.femaleCount = StudentGenderwise.map((item: any) => {
      const maleEntry = item.genderCounts.find((entry: any) => entry._id === 'F');
      return maleEntry ? maleEntry.studentCount : 0;
    });

    this.otherCount = StudentGenderwise.map((item: any) => {
      const maleEntry = item.genderCounts.find((entry: any) => entry._id === 'T');
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
    const categories: any = SchCategory

    this.EnrollMentBySchoolcategoriesGenderWise = JSON.parse(JSON.stringify(this.commonHorizontalBarGraph2));
    this.EnrollMentBySchoolcategoriesGenderWise.series = [...series];
    this.EnrollMentBySchoolcategoriesGenderWise.xaxis.categories = [...categories];

  }

  getStreanWiseCount() {
    this.httpService.get('studentgraph/student-graph-count').subscribe((data: any) => {
      if (data) {
        const StreanWiseCount=data.streanWiseCount
        const AffiliationWiseCount=data.affiliationWiseCount
        const TypeOfStudSchool=data.typeOfSchoolSchoolCount
        const MinorityWiseStudCount=data.minorityWiseCount
        const StudentShiftWiseCounts=data.studentShiftWiseCounts
        const StudentManagementWiseCounts=data.studentManagementWiseCounts
        
        this.getStreamWiseStudent(StreanWiseCount)
        this.getAffiliationWiseCount(AffiliationWiseCount)
        this.getTypeOfStudSchool(TypeOfStudSchool)
        this.getMinorityWiseCount(MinorityWiseStudCount)
        this.getStudentShiftWiseCounts(StudentShiftWiseCounts)
        this.getStudentManagementWiseCounts(StudentManagementWiseCounts)

      }
    })
  }

  getStreamWiseStudent(StreanWiseCount:any){
    const Stream = StreanWiseCount.map((item: any) => item.stream);
    const StreamWiseStudCount = StreanWiseCount.map((item: any) => item.count);

    const series = [{
      name: [""],
      data: StreamWiseStudCount
    }];
    const labels = Stream
    this.StreamWiseStudent = JSON.parse(JSON.stringify(this.commonBarGraph2));
    this.StreamWiseStudent.series = [...series];
    this.StreamWiseStudent.labels = [...labels]
  }

  getAffiliationWiseCount(affiliationWiseCount:any){
    const Affiliation = affiliationWiseCount.map((item:any)=>item.affiliation)
    const affiliationWiseStud= affiliationWiseCount.map((item:any)=>item.count)
   
    this.AffiliationWiseStudent = JSON.parse(JSON.stringify(this.commonPieDonut));
    const series=affiliationWiseStud;
    const labels = Affiliation
    this.AffiliationWiseStudent.series = [...series];
    this.AffiliationWiseStudent.labels = [...labels]

  }

  getTypeOfStudSchool(TypeOfStudSchool:any){
    const TypeOfSchool = TypeOfStudSchool.map((item:any)=>item.typeOfSchool)
    const TypeOfStudCount= TypeOfStudSchool.map((item:any)=>item.count)
   
    this.TypeOfStudSchool = JSON.parse(JSON.stringify(this.commonPieDonut));
    const series=TypeOfStudCount;
    const labels = TypeOfSchool
    this.TypeOfStudSchool.series = [...series];
    this.TypeOfStudSchool.labels = [...labels]
    this.TypeOfStudSchool.chart.type = "pie";

  }

  getMinorityWiseCount(minorityWiseStudCount:any){
    const Minority = minorityWiseStudCount.map((item:any)=>item.minority)
    const StudCount= minorityWiseStudCount.map((item:any)=>item.count)

    this.MinorityWiseStudCount = JSON.parse(JSON.stringify(this.commonPieDonut));
    const series=StudCount;
    const labels = Minority
    this.MinorityWiseStudCount.series = [...series];
    this.MinorityWiseStudCount.labels = [...labels]
    this.MinorityWiseStudCount.chart.type = "pie";
   }

   getStudentShiftWiseCounts(StudentShiftWiseCounts:any){
    const shift = StudentShiftWiseCounts.map((item:any)=>item.shift)
    const StudCount= StudentShiftWiseCounts.map((item:any)=>item.count)

    this.StudentShiftWiseCounts = JSON.parse(JSON.stringify(this.commonPollarChart));
    const series=StudCount;
    const labels = shift
    this.StudentShiftWiseCounts.series = [...series];
    this.StudentShiftWiseCounts.labels = [...labels]
    
   }

   getStudentManagementWiseCounts(StudentManagementWiseCounts:any){
    const SchManagement = StudentManagementWiseCounts.map((item:any)=>item.SchManagement)
    const StudCount= StudentManagementWiseCounts.map((item:any)=>item.count)

    this.StudentManagementWiseCounts = JSON.parse(JSON.stringify(this.commonPieDonut));
    const series=StudCount;
    const labels = SchManagement
    this.StudentManagementWiseCounts.series = [...series];
    this.StudentManagementWiseCounts.labels = [...labels]
   }


  
  }


