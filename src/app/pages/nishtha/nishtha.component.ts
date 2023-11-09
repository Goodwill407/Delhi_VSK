import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
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
  totalCertificationsPercentage: any;

  //Amol
  allDashboardData: any
  Total_Completions: any
  Total_certificates: any
  Total_Courses: any
  Total_Doe: any;
  Total_Local_body: any
  Total_CoursesGraph:any
  Total_MediumGraph:any


  constructor(private httpService: HttpServiceService, private graphService: GraphService, private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.getAllDistrictsData();
    this.getAllData();
    this.getCourse_MediumData()
  }

  getAllDistrictsData() {
    this.httpService.get('learningsession/consumptionbydistrict').subscribe((data: any) => {
      if (data && data.length > 0) {
        this.allDistrictsData = data;
        let allDistrictsName = [];
        for (let i = 0; i < this.allDistrictsData.length; i++) {
          allDistrictsName.push(this.allDistrictsData[i].district_name);
        }
        this.allDistrictsName = allDistrictsName.filter((value, index, self) => self.indexOf(value) === index);
        const event = {
          target: {
            value: this.allDistrictsName[0]
          }
        }
        this.getGraphsByDistrictName(event);
      }
    })
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
    this.getTotalCertificationsPercentage();
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

  getTotalCertificationsPercentage() {
    this.totalCertificationsPercentage = {};
    this.totalCertificationsPercentage = this.graphService.PieGraph('donut', '');
    for (let i = 0; i < this.districtWiseData.length; i++) {
      this.totalCertificationsPercentage.series.push(Number(this.districtWiseData[i].certification));
      this.totalCertificationsPercentage.labels.push(this.districtWiseData[i].program);
    }
  }

  // ===== Amol =====


  getAllData() {
    this.httpService.get('alldashboard').subscribe((data: any) => {
      if (data) {
        const allDashboardData = data;
        this.getTotal_completions(allDashboardData)
        this.getTotal_Certificate_issued(allDashboardData)
        this.getTotal_Courses(allDashboardData)
        this.getTotal_Doe(allDashboardData)
        this.getTotal_Local_Body(allDashboardData)
      }

    })
  }

  getTotal_completions(allDashboardData: any) {
    const Total_Completions = allDashboardData.map((item: any) => item.total_completions)
    const program = allDashboardData.map((item: any) => item.program)
    this.Total_Completions = this.graphService.PieGraph('donut', ' Students');;
    const series = Total_Completions.map((str: any) => Number(str));
    const labels = program
    this.Total_Completions.series = [...series];
    this.Total_Completions.labels = [...labels]
    //  this.Total_Completions.chart.type = "pie";
  }

  getTotal_Certificate_issued(allDashboardData: any) {
    const Total_certificates_issued = allDashboardData.map((item: any) => item.total_certificates_issued)
    const program = allDashboardData.map((item: any) => item.program)
    this.Total_certificates = this.graphService.PieGraph('pie');
    const series = Total_certificates_issued.map((str: any) => Number(str));
    const labels = program
    this.Total_certificates.series = [...series];
    this.Total_certificates.labels = [...labels]
    //  this.Total_Completions.chart.type = "pie";
  }

  getTotal_Courses(allDashboardData: any) {
    const total_Courses = allDashboardData.map((item: any) => item.total_courses)
    const program = allDashboardData.map((item: any) => item.program)
    this.Total_Courses = this.graphService.PolarGraph();
    const series = total_Courses.map((str: any) => Number(str));
    const labels = program
    this.Total_Courses.series = [...series];
    this.Total_Courses.labels = [...labels]
    //  this.Total_Completions.chart.type = "pie";
  }

  getTotal_Doe(allDashboardData: any) {

    //  this.Total_Completions.chart.type = "pie";
    const total_Doe = allDashboardData.map((item: any) => item.doe);
    const program = allDashboardData.map((item: any) => item.program);
    const series = [{
      name: [""],
      data: total_Doe
    }];
    const labels = program
    this.Total_Doe = this.graphService.VerticleBarGraph();
    this.Total_Doe.series = [...series];
    this.Total_Doe.labels = [...labels];
    this.Total_Doe.plotOptions.bar.horizontal = false
  }

  getTotal_Local_Body(allDashboardData: any) {
    const total_Local_body = allDashboardData.map((item: any) => item.local_body)
    const program = allDashboardData.map((item: any) => item.program)
    this.Total_Local_body = this.graphService.PieGraph('donut');
    const series = total_Local_body.map((str: any) => Number(str));
    const labels = program
    this.Total_Local_body.series = [...series];
    this.Total_Local_body.labels = [...labels]
    //  this.Total_Completions.chart.type = "pie";
  }

  // amol2

  getCourse_MediumData(){
   this.httpService.get('alldashboard/coursemedium').subscribe((data:any)=>{
    if(data){
      const TotalData=data;
      
      this.getCoursesGraphData(TotalData)
    this.getMediumGraphData(TotalData)
     }
   })
  }

  getCoursesGraphData(TotalData:any){
    const TotalCourses=TotalData.map((item: any) => item.total_courses)
    const TotalProgram=TotalData.map((item: any) => item.program_name)
    this.Total_CoursesGraph = this.graphService.PieGraph('donut');;
    const series =  TotalCourses.map((str: any) => Number(str));
    const labels = TotalProgram
    this.Total_CoursesGraph.series = [...series];
   this.Total_CoursesGraph.labels = [...labels];
   this.Total_CoursesGraph.legend.formatter= function(val:any){return val;}
  }

  getMediumGraphData(TotalData:any){
    const Total_medium=TotalData.map((item: any) => item.total_medium)
    const TotalProgram=TotalData.map((item: any) => item.program_name)
    this.Total_MediumGraph = this.graphService.PolarGraph();
    const series = Total_medium.map((str:any)=>Number(str))
    const labels = TotalProgram
    this.Total_MediumGraph.series = [...series];
    this.Total_MediumGraph.labels = [...labels]
    //  this.Total_Completions.chart.type = "pie";

  }

}
