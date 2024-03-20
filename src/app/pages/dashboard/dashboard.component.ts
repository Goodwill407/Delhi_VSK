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
  allZoneData: any = [];

  totalCount: any = [];
  user:any;
  constructor(private spinner: NgxSpinnerService, private httpService: HttpServiceService, private toastr: ToastrService) {
    this.user = JSON.parse(sessionStorage.getItem('userProfile')!);
   }

  ngOnInit() {
    this.getSchoolByDistrict();
    this.getSchoolByZone();
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

  getSchoolByZone() {
    const inputString = this.user.assignedTO;

    let regex = /([^-]+)-[0-9]+/;
    let match = inputString.match(regex);
    let valueBeforeHyphen = match ? match[1] : null;
    this.spinner.show();
    this.httpService.post('/graphs/school-student-count/zone',{"district": valueBeforeHyphen}).subscribe((data: any) => {
      if (data) {
        this.allZoneData = data;
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
        // this.spinner.hide();
      }
    }, (error) => {
      this.spinner.hide();
      this.toastr.error('', 'Something went wrong !');
    })
  }


}

