import { Component } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http-service.service';

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

  teachersRatio: any;
  totalSchools: any;

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
    this.getAllData();
    this.getAllSchoolGraph();
  }

  getAllData() {
    this.httpService.get('graphs').subscribe((data: any) => {
      if (data) {
        this.teachersRatio = data.teacherStudentRatio.toFixed(2);
        this.totalSchools = data.totalSchools;

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

  getTypesOfSchools() {
    const series = [44, 55, 41, 17, 15]
    this.typesOfSchools = this.commonPieGraph;
    this.typesOfSchools.series = [...series];
  }

  getShiftWiseSchools(shiftWiseCount: any) {
    const series = [{
      name: "Graphical",
      data: [shiftWiseCount.Morning, shiftWiseCount.Afternoon, shiftWiseCount.Evening, shiftWiseCount.General]
    }];
    const categories = [
      "Morning", "Afternoon", "Evening", "General"
    ]
    this.shiftWiseSchools = JSON.parse(JSON.stringify(this.commonBarGraph));
    this.shiftWiseSchools.series = [...series];
    this.shiftWiseSchools.xaxis.title.text = "Shifts";
    this.shiftWiseSchools.yaxis.title.text = "Total Schools";
    this.shiftWiseSchools.xaxis.categories = [...categories];
  }

}
