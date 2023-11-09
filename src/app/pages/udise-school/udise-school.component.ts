import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GraphService } from 'src/app/services/graph-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-udise-school',
  templateUrl: './udise-school.component.html',
  styleUrls: ['./udise-school.component.css']
})
export class UdiseSchoolComponent {
  TotalSchool:any

  // for Graph
  RuralUrbanCountsGraph:any
  SchoolGenderCountsGraph:any


  constructor(private httpService: HttpServiceService, private spinner: NgxSpinnerService, private route: ActivatedRoute, private graphService: GraphService, private toastr: ToastrService) {
  }

  ngOnInit(){
    this. GetAllUdiseSchoolData()
  }

  GetAllUdiseSchoolData(){
    this.httpService.get('udise-school/udise-school-stats').subscribe((data:any)=>{
      if(data){
        this.TotalSchool =data.totalSchoolCount;
        this.setUdiseSchoolGraphs(data)
                       
        }
    })
  }

  setUdiseSchoolGraphs(data:any){
    const RuralUrbanCounts=data.ruralUrbanCounts
    const School_GenderCounts = data.schoolGenderCounts
    
     this.getRuralUrbanCountsGraph(RuralUrbanCounts)
     this.getSchoolGenderCounts(School_GenderCounts)

  }

  getRuralUrbanCountsGraph(RuralUrbanCounts:any){
     const RuralOrUrban = RuralUrbanCounts.map((item: any) => item._id)
    const RuralOrUrbanCount = RuralUrbanCounts.map((item: any) => item.count)
    this.RuralUrbanCountsGraph = this.graphService.PieGraph('donut', ' student');
    const series = RuralOrUrbanCount;
    const labels = RuralOrUrban
    this.RuralUrbanCountsGraph.series = [...series];
    this.RuralUrbanCountsGraph.labels = [...labels]
   }

   getSchoolGenderCounts(School_GenderCounts: any) {
    const GenderType = School_GenderCounts.map((item: any) => item._id);
    const GenderwiseCount = School_GenderCounts.map((item: any) => item.count);
    const series = [{
      name: [""],
      data: GenderwiseCount
    }];
    const labels = GenderType
    this.SchoolGenderCountsGraph = this.graphService.VerticleBarGraph();
    this.SchoolGenderCountsGraph.series = [...series];
    this.SchoolGenderCountsGraph.labels = [...labels];
    this.SchoolGenderCountsGraph.plotOptions.bar.horizontal = false
  }



  

}
