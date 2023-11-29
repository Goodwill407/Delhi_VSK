import { Component, Input, SimpleChange } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommunicationService } from 'src/app/services/communication.service';
import { GraphService } from 'src/app/services/graph-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-udise-data',
  templateUrl: './udise-data.component.html',
  styleUrls: ['./udise-data.component.css']
})
export class UdiseDataComponent {

  allUdiseData: any;
  graphType: any;

  //Graph
  totalSchoolsData: any;
  subscription: Subscription;

  constructor(private httpService: HttpServiceService, private spinner: NgxSpinnerService, private route: ActivatedRoute, private graphService: GraphService, private toastr: ToastrService, private communicationService: CommunicationService) {
    this.subscription = this.communicationService.parentClick$.subscribe(() => {
      this.totalSchoolsData = {};
      this.getAllUdiseData();
    });
  }

  ngOnInit() {
    this.getAllUdiseData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getAllUdiseData() {
    this.httpService.get('alldashboard2/udise-alldashboard').subscribe((data: any) => {
      if (data && data.length > 0) {
        this.allUdiseData = data;
        this.setGraphData('totalSchoolsToilet');
        this.graphType = "Number of Toilets";
      }
    });
  }

  setTotalSchoolsToilet(seriesData: any, allDistricts: any) {
    this.totalSchoolsData = this.graphService.VerticleBarGraph();
    this.totalSchoolsData.series = [{ name: "Count", data: seriesData }];
    this.totalSchoolsData.xaxis.categories = [...allDistricts];
    this.totalSchoolsData.plotOptions.bar.horizontal = false;
    this.totalSchoolsData.xaxis.title.text = "Districts";
    this.totalSchoolsData.yaxis.title.text = "Count";
  }

  setGraphData(graphType: any) {
    let seriesData = [];
    let allDistricts = [];

    for (let i = 0; i < this.allUdiseData.length; i++) {
      if (graphType == 'totalSchoolsToilet') {
        seriesData.push({ x: 'Total schools toilet', y: this.allUdiseData[i].tot_school_having_toilet_percentage });
        this.graphType = "Number of Toilets";
      } else if (graphType == 'drinkingWater') {
        seriesData.push({ x: 'Drinking water', y: this.allUdiseData[i].school_having_drinking_percentage });
        this.graphType = "Number of drinking waters";
      } else if (graphType == 'electricity') {
        seriesData.push({ x: 'Electricity', y: this.allUdiseData[i].school_having_electricity_percentage });
        this.graphType = "Number of electricity";
      } else if (graphType == 'library') {
        seriesData.push({ x: 'Library', y: this.allUdiseData[i].school_having_library_percentage });
        this.graphType = "Number of libraries";
      } else if (graphType == 'textbook') {
        seriesData.push({ x: 'Textbook', y: this.allUdiseData[i].govt__aided_schools_recieved_textbook_percentage });
        this.graphType = "Number of textbooks";
      } else if (graphType == 'ramp') {
        seriesData.push({ x: 'Ramp', y: this.allUdiseData[i].school_having_ramp_percentage });
        this.graphType = "Number of ramps";
      }
      allDistricts.push(this.allUdiseData[i].district_name)
    }
    this.setTotalSchoolsToilet(seriesData, allDistricts)
  }

}
