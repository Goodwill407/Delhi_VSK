import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { StudentAttendance } from '../../dummy-database';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent {

  todaysAttendance: any;

  constructor(private httpService: HttpServiceService) {
  }

  ngOnInit() {
    this.get();
  }

  get() {
    this.todaysAttendance = StudentAttendance;
  }

}
