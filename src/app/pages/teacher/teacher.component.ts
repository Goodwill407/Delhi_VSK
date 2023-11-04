import { Component } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GraphService } from 'src/app/services/graph-service.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent {
  commonBarGraph: any;
  commonPieGraph: any;
  commonPollarChart: any;
  chartOptions1: any;
  commonTreeMap: any;

  teacherGenderRatio: any;
  studentsGenderRatio: any;
  schoolsManagementWiseTeacher: any;
  schoolTypeWiseCount: any;
  experienceWiseTeacher: any;
  shiftWiseSchools: any;

  teachersRatio: any;
  totalTeacher: any;
  totalMaleTeachers: any;
  totalFemaleTeachers: any;
  averageTeacherOfSchool: any;
  allDistricts: any;
  allSchools: any;
  districtModel: any = "";
  schoolModel: any = "";
  districtName: any;
  schoolName: any;
  designation: any;
  teacherCategory: any;
  streamWiseTeacher: any;
  minorityWiseTeacher: any;

  constructor(private httpService: HttpServiceService, private spinner: NgxSpinnerService, private graphService: GraphService) {
    this.commonBarGraph = {
      series: [
        {
          name: "basic",
          data: []
        }
      ],
      chart: {
        type: "bar",
        height: '600px'
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
        ]
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
        },
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
      ]
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
      events: {
        click: (event: any, chartContext: any, config: any) => {
          alert();
        }
      }
    };

    this.chartOptions1 = {
      series: [
        {
          name: "Teacher",
          data: []
        }
      ],
      chart: {
        type: "bar"
      },
      plotOptions: {
        bar: {
          borderRadius: 0,
          horizontal: true,
          barHeight: "90%",
          isFunnel: false
        }
      },
      colors: [
        "#F44F5E"
      ],

      dataLabels: {
        enabled: true,
        formatter: function (val: any, opt: any) {
          return val;
        },
        dropShadow: {
          enabled: true
        },
      },

      xaxis: {
        categories: []
      },
      legend: {
        show: false
      }
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

  }

  ngOnInit() {
    this.getAllData();
    this.getAllDistricts();
  }

  getAllDistricts() {
    this.httpService.get('graphs/school-student-count-by-district').subscribe((data: any) => {
      if (data && data.length > 0) {
        this.allDistricts = data;
      }
    })
  }

  getAllData() {
    this.httpService.get('graphs').subscribe((data: any) => {
      if (data) {
        this.teachersRatio = data.teacherStudentRatio.toFixed(2);
        this.totalTeacher = data.totalTeachers;
        this.totalMaleTeachers = data.totalMaleTeachers;
        this.totalFemaleTeachers = data.totalFemaleTeachers;
        this.averageTeacherOfSchool = data.averageTeacherOfSchool;

        const teachersGender = {
          totalMaleTeachers: data.totalMaleTeachers,
          totalFemaleTeachers: data.totalFemaleTeachers
        }
        this.getTeachersGenderRatio(teachersGender);
        this.getAllTeacherData();
      }
    })
  }

  getAllTeacherData() {
    this.spinner.show();
    this.httpService.get('teacher-graph/school-category-wise').subscribe((data: any) => {
      if (data) {
        this.getschoolsManagementWiseTeacher(data.teacherManagmentWiseCounts);
        this.getShiftWiseSchools(data.teacherShiftWiseCounts);
        let newData = data.teacherCounts.sort((a: any, b: any) => a.teacherCount - b.teacherCount);
        this.getCategoryWiseTeacher(newData);
        this.getDesignation(data.postdescWiseTeacherCounts);
        this.getExperianceOfTeachers(data.experianceOfTeachers);
        this.getSchoolTypeWiseCount(data);
        this.getStreamWiseCount(data);
        this.getMinorityWiseCount(data);

      }
    })
    this.spinner.hide();
  }

  getGraphsByDistrictName() {
    this.spinner.show();
    const district = {
      DistrictName: this.districtModel
    }
    this.httpService.post('teacher-graph/school-category-wise/district', district).subscribe((data: any) => {
      if (data) {
        this.getschoolsManagementWiseTeacher(data.teacherManagmentWiseCounts);
        this.getShiftWiseSchools(data.teacherShiftWiseCounts);
        let newData = data.teacherCounts.sort((a: any, b: any) => a.teacherCount - b.teacherCount);
        this.getCategoryWiseTeacher(newData);
        this.getDesignation(data.postdescWiseTeacherCounts);
        this.getExperianceOfTeachers(data.experianceOfTeachers);
        this.getSchoolTypeWiseCount(data);
        this.getStreamWiseCount(data);
        this.getMinorityWiseCount(data);
        this.spinner.hide();
      }
    })
    this.spinner.hide();
  }

  getAllSchools() {
    if (this.districtName) {

    }
  }

  getTeachersGenderRatio(teachersGender: any) {
    const series = [teachersGender.totalMaleTeachers, teachersGender.totalFemaleTeachers];
    const categories = ["Male", "Female"];
    this.teacherGenderRatio = JSON.parse(JSON.stringify(this.commonPieGraph));
    this.teacherGenderRatio.series = [...series];
    this.teacherGenderRatio.chart.type = "pie";
    this.teacherGenderRatio.labels = [...categories];
  }

  getShiftWiseSchools(shiftWiseCount: any) {
    let Morning = 0; let Afternoon = 0; let Evening = 0; let General = 0;
    for (let i = 0; i < shiftWiseCount.length; i++) {
      if (shiftWiseCount[i].shift == "General") {
        General = shiftWiseCount[i].teacherShiftWiseCount;
      }
      if (shiftWiseCount[i].shift == "Morning") {
        Morning = shiftWiseCount[i].teacherShiftWiseCount;
      }
      if (shiftWiseCount[i].shift == "Afternoon") {
        Afternoon = shiftWiseCount[i].teacherShiftWiseCount;
      }
      if (shiftWiseCount[i].shift == "Evening") {
        Evening = shiftWiseCount[i].teacherShiftWiseCount;
      }
    }
    const series = [Morning, Afternoon, Evening, General]
    this.shiftWiseSchools = JSON.parse(JSON.stringify(this.commonPollarChart));
    this.shiftWiseSchools.series = [...series];
    this.shiftWiseSchools.labels = ['Morning', 'Afternoon', 'Evening', 'General']
  }


  getschoolsManagementWiseTeacher(schoolManagementWise: any) {
    this.schoolsManagementWiseTeacher = JSON.parse(JSON.stringify(this.commonPieGraph));
    for (let i = 0; i < schoolManagementWise.length; i++) {
      if (schoolManagementWise[i].shift == "Government") { var govCount = schoolManagementWise[i].teacherManagmentWiseCount }
      if (schoolManagementWise[i].shift == "Aided") { var aidedCount = schoolManagementWise[i].teacherManagmentWiseCount }
    }
    this.schoolsManagementWiseTeacher.series = [govCount, aidedCount];
    this.schoolsManagementWiseTeacher.labels = ['Government', 'Aided']
  }

  getCategoryWiseTeacher(data: any) {
    // let teacherCount = [{
    //   name: "Count",
    //   data: []
    // }];
    // let teacherCategory = [];
    // const series: any = [];
    // for (let i = 0; i < data.length; i++) {
    //   teacherCount.push(data[i].teacherCount);
    //   teacherCategory.push(data[i].SchCategory);
    // }
    // this.teacherCategory = this.graphService.VerticleBarGraph();
    // this.teacherCategory.series[0].data = teacherCount;
    // this.teacherCategory.xaxis.categories = teacherCategory;

    this.teacherCategory = this.graphService.VerticleBarGraph();;
    const series: any = [{
      name: "Count",
      data: []
    }];
    for (let i = 0; i < data.length; i++) {
      series[0].data.push(data[i].teacherCount);
      this.teacherCategory.xaxis.categories.push(data[i].SchCategory);
    }
    this.teacherCategory.series = [...series];


  }

  getExperianceOfTeachers(data: any) {
    this.experienceWiseTeacher = JSON.parse(JSON.stringify(this.chartOptions1));
    this.experienceWiseTeacher.series[0].data = [data.under5Years, data.fiveTo10Years, data.tenTo15Years, data.fifteenTo20Years, data.twentyTo25Years, data.over25Years];
    this.experienceWiseTeacher.xaxis.categories = ['0-5 Years', '5-10 Years', '10-15 Years', '15-20 Years', '20-25 Years', '25 + Years'];

  }

  getDesignation(post: any) {
    this.designation = JSON.parse(JSON.stringify(this.commonBarGraph));
    let data = [];
    let categories = [];
    for (let i = 0; i < post.length; i++) {
      data.push(post[i].teacherCount);
      categories.push(post[i]._id);
    }
    this.designation.series[0].data = data;
    this.designation.xaxis.categories = categories;
  }

  getSchoolTypeWiseCount(data: any) {
    this.schoolTypeWiseCount = JSON.parse(JSON.stringify(this.commonPollarChart));

    this.schoolTypeWiseCount.series = [170, 150, 90];
    this.schoolTypeWiseCount.labels = ['Girls', 'Boys', 'Co-edu']
  }

  getStreamWiseCount(data: any) {
    this.streamWiseTeacher = JSON.parse(JSON.stringify(this.commonPieGraph));
    this.streamWiseTeacher.chart.type = "pie";
    this.streamWiseTeacher.series = [90, 150, 200, 320, 12];
    this.streamWiseTeacher.labels = ['Art', 'Science', 'Commerce', 'Vocational', 'Other']
  }

  getMinorityWiseCount(data: any) {
    this.minorityWiseTeacher = JSON.parse(JSON.stringify(this.commonPieGraph));
    this.minorityWiseTeacher.series = [280, 200];
    this.minorityWiseTeacher.labels = ['YES', 'NO']
  }
}
