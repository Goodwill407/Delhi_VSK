import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommunicationService } from 'src/app/services/communication.service';
import { GraphService } from 'src/app/services/graph-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-nas',
  templateUrl: './nas.component.html',
  styleUrls: ['./nas.component.css']
})
export class NasComponent {
  // Graphs
  teacherGenderRatio: any;
  studentsGenderRatio: any;
  districtWiseGraph: any;
  allZones: any;

  // Single data
  allData: any[] = [];
  allTableData: any[] = [];
  performanceArray: any[] = [];
  allDistrictsName: any[] = [];
  mostData: any = [];
  allDistricts: any;
  gradeModel: any = "";
  subjectModel: any = "";
  shiftModel: any = "";
  districtName: any;
  genderWisePresent: any;
  genderWiseAbsent: any;
  allSubject: any = ["Math", 'Sst', 'Sci',"Evs","Language","Eng","Mil"];
  allGrade: any = ["Grade 3","Grade 5","Grade 8","Grade 10"];
  filterData:any;
  communicationServiceMobile: any;


  constructor( private communicationService:CommunicationService,private httpService: HttpServiceService, private spinner: NgxSpinnerService, private route: ActivatedRoute, private graphService: GraphService, public datepipe: DatePipe) {
    this.communicationServiceMobile = this.communicationService.isMobile;

  }

  ngOnInit() {
    this.getAllDataOfNAS();
    // this.getDataByfilter();
  }


  getDataByfilter(){
    this.allData = [];
    this.allTableData = [];
    this.mostData = [];
  if(this.subjectModel && this.gradeModel){
    this.filterData = {
      "subject": this.subjectModel,
      "grade": this.gradeModel
    }
  }
  else if(this.subjectModel){
    this.filterData = {
      "subject": this.subjectModel
    }
  }
  else if(this.gradeModel){
    this.filterData = {
      "grade": this.gradeModel
    }
  }
    this.httpService.post('alldashboard/dashboard', this.filterData).subscribe((res: any) => {
     this.allData = res.data;
      this.allTableData = this.allData;
      let allTableData: any[] = [];

      for (let i = 0; i < this.allTableData.length; i++) {
        allTableData.push(this.allTableData[i].district_name);
      }
      allTableData = allTableData.filter((value, index, self) => self.indexOf(value) === index);

      for (let j = 0; j < allTableData.length; j++) {
        for (let i = 0; i < this.allTableData.length; i++) {
          if (allTableData[j] == this.allTableData[i].district_name) {
            if (!this.mostData[allTableData[j]]) {
              this.mostData[allTableData[j]] = [];
            }
            this.mostData[allTableData[j]].push(this.allTableData[i]);
            this.mostData[allTableData[j]] = this.mostData[allTableData[j]].filter((value: any, index: any, self: any) =>
              index === self.findIndex((t: any) => (
                t.learning_outcome_code === value.learning_outcome_code
              ))
            )
          }
        }
      }
    })
  }

  getAllDataOfNAS() {
    this.httpService.get('alldashboard/nas-alldashboard').subscribe((res:any)=>{
      this.allData = res;
      this.allTableData = this.allData;
      let allTableData: any[] = [];

      for (let i = 0; i < this.allTableData.length; i++) {
        allTableData.push(this.allTableData[i].district_name);
      }
      allTableData = allTableData.filter((value, index, self) => self.indexOf(value) === index);

      for (let j = 0; j < allTableData.length; j++) {
        for (let i = 0; i < this.allTableData.length; i++) {
          if (allTableData[j] == this.allTableData[i].district_name) {
            if (!this.mostData[allTableData[j]]) {
              this.mostData[allTableData[j]] = [];
            }
            this.mostData[allTableData[j]].push(this.allTableData[i]);
            this.mostData[allTableData[j]] = this.mostData[allTableData[j]].filter((value: any, index: any, self: any) =>
              index === self.findIndex((t: any) => (
                t.learning_outcome_code === value.learning_outcome_code
              ))
            )
          }
        }
      }

      this.allDistricts = this.allTableData.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.district_name === value.district_name
        ))
      )

      this.allData = this.allData.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.learning_outcome_code === value.learning_outcome_code
        ))
      )
    })
  }

}
