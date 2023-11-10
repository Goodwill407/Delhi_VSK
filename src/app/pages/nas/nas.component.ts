import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
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
  allData: any;
  allTableData: any[] = [];
  allDistricts: any;
  gradeModel: any = "";
  subjectModel: any = "";
  shiftModel: any = "";
  districtName: any;
  genderWisePresent: any;
  genderWiseAbsent: any;
  allShift: any = ['Morning', 'General', 'Evening'];

  constructor(private httpService: HttpServiceService, private spinner: NgxSpinnerService, private route: ActivatedRoute, private graphService: GraphService, public datepipe: DatePipe) {

  }

  ngOnInit() {
    this.getAllDistricts();
    this.getAllZones();
    this.getAllDataOfNAS();
  }

  getDate(date: any) {
    let Mdate: any;
    return Mdate = this.datepipe.transform(date, 'dd/MM/yyyy');
  }

  removeDuplicates(arr: Array<{ key: string, value: any }>): Array<{ key: string, value: any }> {
    const uniqueMap = new Map<string, { key: string, value: any }>();

    for (const obj of arr) {
      uniqueMap.set(obj.key, obj);
    }

    return Array.from(uniqueMap.values());
  }

  getAllDataOfNAS() {
    const sub = {
      "subject": "Sst",
      "grade": "Grade 10"
    }
    this.httpService.post('alldashboard/dashboard', sub).subscribe((res: any) => {
      this.allData = res.data;
      this.allTableData = this.allData;

      this.allTableData = this.allTableData.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.district_name === value.district_name
        ))
      )
      // this.allTableData = this.removeDuplicates(data);
      console.log(this.allTableData);

    })
  }

  getAllDistricts() {
  
  }

  getAllSchoolGraph() {
    this.httpService.get('attendance/date-wise').subscribe((data: any) => {
      if (data) {
        
      }
    })
  }

  getAllZones() {
    if (this.gradeModel) {
      const district = { "District_name": this.gradeModel };
      this.httpService.post('school/getDistrictZone', district).subscribe((res: any) => {
        this.allZones = res.ZoneSchool;
      })
    } else {
      this.httpService.get('school/zonename').subscribe((res: any) => {
        this.allZones = res.ZoneNames;
      })
    }
  }

 

}
