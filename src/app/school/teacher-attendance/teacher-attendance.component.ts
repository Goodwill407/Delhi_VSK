import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-teacher-attendance',
  templateUrl: './teacher-attendance.component.html',
  styleUrls: ['./teacher-attendance.component.css']
})
export class TeacherAttendanceComponent {

  dateModel: any = "";
  allStudents: any[] = [];
  studentData: any;

  constructor(private httpService: HttpServiceService, private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
  }

  getAllStudents() {
    if (this.dateModel) {
      this.allStudents = [{
        name: 'Rahul Sharma',
        gender: 'Male',
        class: '1',
        section: 'A'
      },
      {
        name: 'Riya Joshi',
        gender: 'Female',
        class: '2',
        section: 'B'
      },
      {
        name: 'Vinod Roy',
        gender: 'Male',
        class: '3',
        section: 'c'
      }]
    }
  }

  resetPassword(student: any) {
    if (student) {
      this.studentData = student;
    }
  }
}
