import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-exam-report',
  templateUrl: './exam-report.component.html',
  styleUrls: ['./exam-report.component.css']
})
export class ExamReportComponent {

  classModel: any = "";
  sectionModel: any = "";

  allClasses: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  allSections: any[] = ['A', 'B', 'C', 'D', 'E', 'F'];
  allStudents: any[] = [];

  studentData: any;

  constructor(private httpService: HttpServiceService, private spinner: NgxSpinnerService) {
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
