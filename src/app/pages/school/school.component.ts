import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent {

  commonBarGraph: any;
  commonPieGraph: any;
  commonPollarChart: any;
  commonTreeMap: any;

  // Graphs
  teacherGenderRatio: any;
  studentsGenderRatio: any;
  typesOfSchools: any;
  shiftWiseSchools: any;
  schoolsByManagement: any;
  lowClassHighClass: any;
  allZones: any;

  // Single data
  teachersRatio: any;
  totalSchools: any;
  averageTeacherOfSchool: any;
  averageStudentOfSchool: any;
  allDistricts: any;
  districtModel: any = "";
  districtName: any;

  constructor(private httpService: HttpServiceService, private spinner: NgxSpinnerService, private route: ActivatedRoute) {
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
      labels: [],
      legend: {
        formatter: function (val: any, opts: any) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex];
        }
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
      ]
    };

    this.commonPollarChart = {
      series: [],
      chart: {
        type: "polarArea"
      },
      stroke: {
        colors: ["#fff"]
      },
      fill: {
        opacity: 0.8
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

    this.commonTreeMap = {
      series: [
        {
          data: []
        }
      ],

      legend: {
        show: false
      },
      chart: {
        height: 350,
        type: "treemap"
      },
      title: {
        text: "Multi-dimensional Treemap",
        align: "center"
      },
      events: {
        click: (event: any, chartContext: any, config: any) => {
          alert();
        }
      }
    };
  }

  ngOnInit() {
    this.getAllData();
    this.getAllSchoolGraph();
    this.getAllDistricts();
    this.getDistrictName();
  }

  getAllDistricts() {
    this.httpService.get('graphs/school-student-count-by-district').subscribe((data: any) => {
      if (data && data.length > 0) {
        this.allDistricts = data;
      }
    })
  }

  getGraphsByDistrictName() {
    this.spinner.show();
    const district = {
      districtName: this.districtModel
    }
    this.httpService.post('graphs/school-student-teacher-graph-districtname', district).subscribe((data: any) => {
      if (data) {
        this.totalSchools = data.totalSchools;
        this.averageTeacherOfSchool = data.averageTeacherOfSchool?.toFixed(2);
        this.averageStudentOfSchool = data.averageStudentOfSchool?.toFixed(2);
        this.teachersRatio = data.teacherStudentRatio?.toFixed(2);

        //
        const studentsGender = {
          totalBoys: data.totalBoys,
          totalGirls: data.totalGirls
        }
        this.getStudentsGenderRatio(studentsGender);

        const teachersGender = {
          totalMaleTeachers: data.totalMaleTeachers,
          totalFemaleTeachers: data.totalFemaleTeachers
        }
        this.getTeachersGenderRatio(teachersGender);

        //
        this.getShiftWiseSchools(data.shiftWiseCount);
        this.getSchoolsByManagement(data.schoolManagementWise);
        const lowClassHighClass = {
          lowClassCount: data.lowClassCount,
          highClassCount: data.highClassCount
        }
        this.getLowClassHighClass(lowClassHighClass);
        this.spinner.hide();
        this.getAllZones(data.zoneWiseCounts);
      }
    }, (error) => {
      this.spinner.hide();
    })
  }

  getAllData() {
    this.httpService.get('graphs').subscribe((data: any) => {
      if (data) {
        this.teachersRatio = data.teacherStudentRatio?.toFixed(2);
        this.totalSchools = data.totalSchools;
        this.averageStudentOfSchool = data.averageStudentOfSchool?.toFixed(2);;
        this.averageTeacherOfSchool = data.averageTeacherOfSchool?.toFixed(2);;

        const studentsGender = {
          totalBoys: data.totalBoys,
          totalGirls: data.totalGirls
        }
        this.getStudentsGenderRatio(studentsGender);

        const teachersGender = {
          totalMaleTeachers: data.totalMaleTeachers,
          totalFemaleTeachers: data.totalFemaleTeachers
        }
        this.getTeachersGenderRatio(teachersGender);
      }
    })
  }

  getAllSchoolGraph() {
    this.httpService.get('graphs/school-graph').subscribe((data: any) => {
      if (data) {
        this.getShiftWiseSchools(data.shiftWiseCount);
        this.getSchoolsByManagement(data.schoolManagementWise);
        const lowClassHighClass = {
          lowClassCount: data.lowClassCount,
          highClassCount: data.highClassCount
        }
        this.getLowClassHighClass(lowClassHighClass);
        this.getAllZones(data.zoneWiseCounts);
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

  getTeachersGenderRatio(teachersGender: any) {
    const series = [{
      name: "Graphical",
      data: [teachersGender.totalMaleTeachers, teachersGender.totalFemaleTeachers]
    }];
    const categories = [
      "Male", "Female"
    ]
    this.teacherGenderRatio = JSON.parse(JSON.stringify(this.commonBarGraph));
    this.teacherGenderRatio.series = [...series];
    this.teacherGenderRatio.xaxis.title.text = "Teachers Gender";
    this.teacherGenderRatio.yaxis.title.text = "Total Teachers";
    this.teacherGenderRatio.xaxis.categories = [...categories];
  }

  getSchoolsByManagement(schoolManagementWise: any) {
    this.schoolsByManagement = JSON.parse(JSON.stringify(this.commonPieGraph));
    this.schoolsByManagement.series = [schoolManagementWise.Government, schoolManagementWise.Aided];
    this.schoolsByManagement.labels = ['Government', 'Aided']
  }

  getShiftWiseSchools(shiftWiseCount: any) {
    const series = [shiftWiseCount.Morning, shiftWiseCount.Afternoon, shiftWiseCount.Evening, shiftWiseCount.General]
    this.shiftWiseSchools = JSON.parse(JSON.stringify(this.commonPollarChart));
    this.shiftWiseSchools.series = [...series];
    this.shiftWiseSchools.labels = ['Morning', 'Afternoon', 'Evening', 'General']
  }

  getLowClassHighClass(lowClassHighClass: any) {
    this.lowClassHighClass = JSON.parse(JSON.stringify(this.commonPieGraph));
    this.lowClassHighClass.series = [lowClassHighClass.lowClassCount, lowClassHighClass.highClassCount];
    this.lowClassHighClass.labels = ['Low class', 'High class']
  }

  getAllZones(allZones: any) {
    this.allZones = JSON.parse(JSON.stringify(this.commonTreeMap));
    for (let i = 0; i < allZones.length; i++) {
      this.allZones.series[0].data.push({ x: allZones[i].zone, y: allZones[i].count });
    }
  }

  getDistrictName() {
    this.route.queryParams.subscribe((param: any) => {
      this.districtName = param['districtName'];
      if (this.districtName) {
        this.districtModel = this.districtName;
        this.getGraphsByDistrictName();
      }
    })
  }

}
