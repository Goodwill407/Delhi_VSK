import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  allDistrictData: any = [];

  totalCount: any = [];
  constructor(private spinner: NgxSpinnerService, private httpService: HttpServiceService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getSchoolByDistrict();
    this.allTotalCount();
  }

  getSchoolByDistrict() {
    this.spinner.show();
    this.httpService.get('graphs/school-student-count-by-district').subscribe((data: any) => {
      if (data) {
        this.allDistrictData = data;
        this.spinner.hide();
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error('', 'Something went wrong !');
    })
  }

  allTotalCount() {
    this.spinner.show();
    this.httpService.get('graphs/school-teacher-student-graph').subscribe((data: any) => {
      if (data) {
        this.totalCount = data;
        this.spinner.hide();
      }
    }, (error) => {
      this.spinner.hide();
      this.toastr.error('', 'Something went wrong !');
    })
  }
}

