import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { GraphService } from 'src/app/services/graph-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-diksha',
  templateUrl: './diksha.component.html',
  styleUrls: ['./diksha.component.css']
})
export class DikshaComponent {

  allMedium: any;
  allGrade: any;
  allSubject: any;
  allQrCoverage: any;

  constructor(private httpService: HttpServiceService, private graphService: GraphService, private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.getAllCoverageQr();
  }

  getAllCoverageQr() {
    this.httpService.get('alldashboard3/coverageqr').subscribe((data: any) => {
      this.allQrCoverage = data;
      for (let i = 0; i < this.allQrCoverage.length; i++) {
        this.allMedium.push(this.allQrCoverage[i].medium);
        this.allGrade.push(this.allQrCoverage[i].grade);
        this.allSubject.push(this.allQrCoverage[i].subject);
      }
    })
  }

}
