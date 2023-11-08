import { Component } from '@angular/core';
import { GraphService } from 'src/app/services/graph-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-nishtha',
  templateUrl: './nishtha.component.html',
  styleUrls: ['./nishtha.component.css']
})
export class NishthaComponent {

  districtModel: any = "";
  allDistrictsData: any;
  allDistrictsName: any;
  districtWiseData: any = [];

  //Graph
  totalEnrollments: any;
  totalCompletion: any;
  totalCertifications: any;

  constructor(private httpService: HttpServiceService, private graphService: GraphService) {
  }

  ngOnInit() {
    this.getAllDistrictsData();
  }

  getGraphsByDistrictName(event: any) {
    if (event && event.target) {
      this.districtWiseData = [];
      this.districtModel = event.target.value;
      for (let i = 0; i < this.allDistrictsData.length; i++) {
        if (event.target.value == this.allDistrictsData[i].district_name) {
          this.districtWiseData.push(this.allDistrictsData[i]);
        }
      }
      this.setGraphData();
    }
  }

  setGraphData() {
    this.getTotalEnrollments();
    this.getTotalCompletion();
    this.getTotalCertifications();
  }

  getTotalEnrollments() {
    this.totalEnrollments = {};
    this.totalEnrollments = this.graphService.PieGraph('donut', '');
    for (let i = 0; i < this.districtWiseData.length; i++) {
      this.totalEnrollments.series.push(Number(this.districtWiseData[i].total_enrollments));
      this.totalEnrollments.labels.push(this.districtWiseData[i].program);
    }
  }

  getTotalCompletion() {
    this.totalCompletion = {};
    this.totalCompletion = this.graphService.PieGraph('donut', '');
    for (let i = 0; i < this.districtWiseData.length; i++) {
      this.totalCompletion.series.push(Number(this.districtWiseData[i].total_completion));
      this.totalCompletion.labels.push(this.districtWiseData[i].program);
    }
  }

  getTotalCertifications() {
    this.totalCertifications = {};
    this.totalCertifications = this.graphService.PieGraph('donut', '');
    for (let i = 0; i < this.districtWiseData.length; i++) {
      this.totalCertifications.series.push(Number(this.districtWiseData[i].total_certifications));
      this.totalCertifications.labels.push(this.districtWiseData[i].program);
    }
  }

  getAllDistrictsData() {
    this.httpService.get('learningsession/consumptionbydistrict?limit=10&page=1').subscribe((data: any) => {
      if (data && data.results.length > 0) {
        this.allDistrictsData = data.results;
        let allDistrictsName = [];
        for (let i = 0; i < this.allDistrictsData.length; i++) {
          allDistrictsName.push(this.allDistrictsData[i].district_name);
        }
        this.allDistrictsName = allDistrictsName.filter((value, index, self) => self.indexOf(value) === index);
      }
    })
  }

}
