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
  ShiftfSchoolCountsGraph:any
  TypeofSchoolCountsGraph:any


  constructor(private httpService: HttpServiceService, private spinner: NgxSpinnerService, private route: ActivatedRoute, private graphService: GraphService, private toastr: ToastrService) {
  }

  ngOnInit(){
    this. GetAllUdiseSchoolData()
  }

  GetAllUdiseSchoolData(){
   
    this.spinner.show();
    this.httpService.get('udise-school/udise-school-stats').subscribe((data: any) => {
      if (data) {
        this.TotalSchool = data.totalSchoolCount;
        this.setUdiseSchoolGraphs(data)
        this.spinner.hide();
      }
    }, (error) => {
      this.toastr.error('', 'Something went wrong !');
    })
  }

  setUdiseSchoolGraphs(data:any){
    const RuralUrbanCounts=data.ruralUrbanCounts
    const School_GenderCounts = data.schoolGenderCounts
    const ShiftfSchoolCounts =data.shiftofschoolCounts
    const TypeofschoolCounts=data.typeofschoolCounts
    
     this.getRuralUrbanCountsGraph(RuralUrbanCounts)
     this.getSchoolGenderCounts(School_GenderCounts)
     this.getShiftWiseCountGraph(ShiftfSchoolCounts)
     this.getTypeofSchoolCountsGraph(TypeofschoolCounts)

  }

  getRuralUrbanCountsGraph(RuralUrbanCounts:any){
     const RuralOrUrban = RuralUrbanCounts.map((item: any) => item._id)
    const RuralOrUrbanCount = RuralUrbanCounts.map((item: any) => item.count)
    this.RuralUrbanCountsGraph = this.graphService.PieGraph('donut', '');
    const series = RuralOrUrbanCount;
    const labels = RuralOrUrban
    this.RuralUrbanCountsGraph.series = [...series];
    this.RuralUrbanCountsGraph.labels = [...labels]
   }

   getSchoolGenderCounts(School_GenderCounts:any){
    const GenderType = School_GenderCounts.map((item: any) => item._id)
    const GenderWiseCount = School_GenderCounts.map((item: any) => item.count)
    this.SchoolGenderCountsGraph = this.graphService.PieGraph('pie', '');
    const series = GenderWiseCount;
    const labels = GenderType
    this.SchoolGenderCountsGraph.series = [...series];
    this.SchoolGenderCountsGraph.labels = [...labels]

   }

   getShiftWiseCountGraph(Shift_ofSchoolCounts:any){
    const TypeOfShift = Shift_ofSchoolCounts.map((item: any) => item._id)
    const ShiftWiseCount = Shift_ofSchoolCounts.map((item: any) => item.count)
    this.ShiftfSchoolCountsGraph = this.graphService.PolarGraph();
    const series = ShiftWiseCount;
    const labels = TypeOfShift
    this.ShiftfSchoolCountsGraph.series = [...series];
    this.ShiftfSchoolCountsGraph.labels = [...labels]

   }

   getTypeofSchoolCountsGraph(Type_Of_School_count:any){
    const TypeOfSchool = Type_Of_School_count.map((item: any) => item._id)
    const TypeOfschoolCount = Type_Of_School_count.map((item: any) => item.count)
    this.TypeofSchoolCountsGraph = this.graphService.PieGraph('donut', '');
    const series = TypeOfschoolCount;
    const labels = TypeOfSchool
    this.TypeofSchoolCountsGraph.series = [...series];
    this.TypeofSchoolCountsGraph.labels = [...labels]

   }

   



  

}
