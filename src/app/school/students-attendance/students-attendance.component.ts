import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-students-attendance',
  templateUrl: './students-attendance.component.html',
  styleUrls: ['./students-attendance.component.css']
})
export class StudentsAttendanceComponent {

  classModel: any = "";
  sectionModel: any = "";
  dateModel: any = "";

  allClasses: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  allSections: any[] = ['A', 'B', 'C', 'D', 'E', 'F'];
  allStudents: any[] = [];

  studentData: any;

  constructor(private httpService: HttpServiceService, private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
  }

  getAllStudents() {
    if (this.classModel && this.sectionModel && this.dateModel) {
      this.allStudents = [{
        name: 'Rahul Sharma',
        gender: 'Male'
      },
      {
        name: 'Riya Joshi',
        gender: 'Female'
      },
      {
        name: 'Vinod Roy',
        gender: 'Male'
      }]
    }
  }

  resetPassword(student: any) {
    if (student) {
      this.studentData = student;
    }
  }

}
