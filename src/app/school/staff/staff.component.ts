import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent {

  allTeachers: any[] = [];
  studentData: any;

  constructor(private httpService: HttpServiceService, private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.getAllTeachers();
  }

  getAllTeachers() {
    this.allTeachers = [{
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

  resetPassword(student: any) {
    if (student) {
      this.studentData = student;
    }
  }

}
