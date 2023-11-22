import { Component } from '@angular/core';

@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.css']
})
export class AttendanceReportComponent {

  classModel: any = "";
  sectionModel: any = "";

  allClasses: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  allSections: any[] = ['A', 'B', 'C', 'D', 'E', 'F'];
  allStudents: any[] = [];

  chartOptions: any;

  studentData: any;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Present",
          data: [44, 55, 41, 67, 22, 43]
        },
        {
          name: "Absent",
          data: [13, 23, 20, 8, 13, 27]
        }
      ],
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        stackType: "100%"
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
      xaxis: {
        categories: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ]
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: "right",
        offsetX: 0,
        offsetY: 50
      }
    };
  }

  ngOnInit() {
  }

  getAllStudents() {
    if (this.classModel && this.sectionModel) {
      this.allStudents = [{
        name: 'Rahul Sharma',
        dob: '12/04/2010',
        father: 'Amit',
        gender: 'Male',
        status: 'Studying'
      },
      {
        name: 'Riya Joshi',
        dob: '30/07/2010',
        father: 'Kiran',
        gender: 'Female',
        status: 'Studying'
      },
      {
        name: 'Vinod Roy',
        dob: '26/09/2010',
        father: 'Rohit',
        gender: 'Male',
        status: 'Studying'
      }]
    }
  }

  resetPassword(student: any) {
    if (student) {
      this.studentData = student;
    }
  }

  viewProfile(student: any) {
    if (student) {
      this.studentData = student;
    }
  }

}
