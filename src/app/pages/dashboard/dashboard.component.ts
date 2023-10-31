import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  allDistrictData: any =[];

  totalCount:any = [];
  constructor(private httpService: HttpServiceService) {}

  ngOnInit(){
    this.getSchoolByDistrict();
    this.allTotalCount();
  }

  getSchoolByDistrict(){
    this.httpService.get('graphs/school-student-count-by-district').subscribe((data: any) => {
      if (data) {
        this.allDistrictData =data;
      }
    })
  }

  allTotalCount(){
    this.httpService.get('graphs').subscribe((data: any) => {
      if (data) {
        this.totalCount =data;
      }
    })
  }
}

