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
 
  // dropdownModel
  mediumModel:any=''
  gradeModel:any=''
  subjectModel:any=''

  // graphName
  TotalCountsGraph:any;
  Average_no_of_playsGraph:any;
  Average_play_timeGraph:any



  constructor(private httpService: HttpServiceService, private graphService: GraphService, private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.getAllCoverageQr();
    this.getAllCounts_learningsession()
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

  getAllCounts_learningsession(){
    const Data={
      subject: "English",
      grade: "Class 10",
      medium: "English"
    }
    this.httpService.post('learningsession/counts-learningsession',Data).subscribe((data:any)=>{
      if(data){
        const AllCounts_learningsession=data

        this.getTotalCountGraph(AllCounts_learningsession)
        this.getTotalAverage_no_of_playsGraph(AllCounts_learningsession)
        this.getTotalAverage_play_timeGraph(AllCounts_learningsession)

      }
    })
  }

  getTotalCountGraph(all_Data:any){
    const LableName = all_Data.map((item:any)=>item._id)
    const TotalCounts =all_Data.map((item:any)=>item.counts)
    this.TotalCountsGraph = this.graphService.PieGraph('donut', '');
    const series = TotalCounts;
    const labels = LableName
    this.TotalCountsGraph.series = [...series];
    this.TotalCountsGraph.labels = [...labels]
   

  }

  getTotalAverage_no_of_playsGraph(all_Data:any){
    const LableName = all_Data.map((item:any)=>item._id)
    const Average_no_of_playsCount =all_Data.map((item:any)=>item.average_no_of_plays)
    this.Average_no_of_playsGraph = this.graphService.PieGraph('donut', '');
    const series = Average_no_of_playsCount.map((item:any)=> parseFloat(item.toFixed(2)));
    const labels = LableName
    this.Average_no_of_playsGraph.series = [...series];
    this.Average_no_of_playsGraph.labels = [...labels]
    // this.Average_no_of_playsGraph.legend.formatter = function (val: any) { return val; }
    

  }

  getTotalAverage_play_timeGraph(all_Data:any){
    const LableName = all_Data.map((item:any)=>item._id)
    const Average_play_timeCounts =all_Data.map((item:any)=>item.average_play_time)
    this.Average_play_timeGraph = this.graphService.PieGraph('donut', '');
    const series = Average_play_timeCounts.map((item:any)=> parseFloat(item.toFixed(2)));
    const labels = LableName;
    this.Average_play_timeGraph.series = [...series];
    this.Average_play_timeGraph.labels = [...labels];
    // this.Average_play_timeGraph.legend.formatter = function (val: any) { return val; }
    

  }
}
