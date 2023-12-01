import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { GraphService } from 'src/app/services/graph-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-attendance-range-wise',
  templateUrl: './attendance-range-wise.component.html',
  styleUrls: ['./attendance-range-wise.component.css']
})
export class AttendanceRangeWiseComponent {

  // Graphs
  genderWisePresent: any;
  genderWiseAbsent: any;
  genderWiseLeave: any;
  genderWiseNotMarked: any;

  allDistricts: any;
  allSchools: any;
  districtModel: any = "";
  schoolModel: any = "";
  zoneModel: any = "";
  dateModel1: any;
  dateModel2: any;
  allZones: any;
  districtName: any;
  schoolName: any;

  constructor(private httpService: HttpServiceService, public datepipe: DatePipe, private spinner: NgxSpinnerService, private graphService: GraphService) { }

  ngOnInit() {
    this.getAllTeacherData();
    this.getAllDistricts();
    this.getAllZones();
  }

  getAllDistricts() {
    this.httpService.get('school/districtNames').subscribe((data: any) => {
      if (data && data.length > 0) {
        this.allDistricts = data;
      }
    })
  }

  getAllTeacherData() {
    this.spinner.show();
    this.httpService.get('teacher-graph/school-category-wise').subscribe((data: any) => {
      if (data) {
        this.spinner.hide();
      }
    })
  }

  getGraphsByDistrictName() {
    if (this.districtModel) {
      const district = {
        DistrictName: this.districtModel
      }
      this.spinner.show();
      this.httpService.post('teacher-graph/school-category-wise/district', district).subscribe((data: any) => {
        if (data) {
          // this.setAllGraphs(data);
          this.getAllZones();
          this.getAllSchools();
          this.zoneModel = '';
          this.schoolModel = '';
        }
      })
    } else {
      this.getAllTeacherData();
      this.getAllZones();
      this.allSchools = [];
      this.zoneModel = '';
      this.schoolModel = '';
    }
  }

  getDate(date: any) {
    let Mdate: any;
    return Mdate = this.datepipe.transform(date, 'dd/MM/yyyy');
  }

  datePicker() {
    if (this.dateModel1 && this.dateModel2) {
      const obj = {
        "schoolId": this.schoolModel.Schoolid,
        "startDate": this.getDate(this.dateModel1),
        "endDate": this.getDate(this.dateModel2),
        "zoneName": this.zoneModel,
        "districtName": this.districtModel
      };

      if(!this.schoolModel){
        delete obj.schoolId;
      }
      if(!this.districtModel){
        delete obj.districtName;
      }
      if(!this.zoneModel){
        delete obj.zoneName;
      };

      this.httpService.post('attendance/attendancepercentage/range/parameter', obj).subscribe((res: any) => {
        this.setAllGraphs(res.overallPercentage);
      })

    }
  }

  getAllZones() {
    if (this.districtModel) {
      const district = { "District_name": this.districtModel };
      this.httpService.post('school/getDistrictZone', district).subscribe((res: any) => {
        this.allZones = res.ZoneSchool;
      })
    } else {
      this.httpService.get('school/zonename').subscribe((res: any) => {
        this.allZones = res.ZoneInfo;
      })
    }
  }

  getGraphsByZone() {
    this.spinner.show();
    const zone = {
      zoneName: this.zoneModel
    }
    this.httpService.post('teacher-graph/school-category-wise/zone', zone).subscribe((data: any) => {
      if (data) {
        // this.setAllGraphs(data);
        this.spinner.hide();
      }
    }, (error: any) => {
      this.spinner.hide();
    });
    this.getSchoolDataByZone();
  }

  getSchoolDataByZone() {
    const zone = {
      Zone_Name: this.zoneModel
    }
    this.httpService.post('school/getZoneSchool', zone).subscribe((data: any) => {
      if (data && data.ZoneSchool) {
        this.allSchools = data.ZoneSchool;
        this.schoolModel = ''
      } else {
        this.allSchools = [];
      }
    });
  }

  getAllSchools() {
    const district = {
      District_name: this.districtModel
    }
    this.httpService.post('school/getDistrictSchool', district).subscribe((data: any) => {
      if (data && data.districtSchools) {
        this.allSchools = data.districtSchools;
      } else {
        this.allSchools = [];
      }
    });
  }

  getGraphsBySchoolName() {
    const school = {
      schname: String(this.schoolModel.Schoolid)
    }
    this.spinner.show();
    this.httpService.post('teacher-graph/school-category-wise/school', school).subscribe((data: any) => {
      if (data) {
        // this.setAllGraphs(data);
        this.spinner.hide();
      }
      this.spinner.hide();
    })
  }

  setAllGraphs(data: any) {
    this.getGenderWiseAbsent(data);
    this.getGenderWiseLeave(data);
    this.getGenderWisePresent(data);
    this.getGenderWiseNotMarked(data);
  }

  getGenderWisePresent(present: any) {
    this.genderWisePresent = this.graphService.PieGraph('donut', " Students");
    let series = [present.malePresentPercentage, present.feMalePresentPercentage, present.otherPresentPercentage];
    this.genderWisePresent.series = series.map((item: any) => (item !== undefined ? Number(item == 0 ? 0 : item?.toFixed(2)) : 0));
    this.genderWisePresent.labels = ["Boys", "Girls", "Others"];
  }

  getGenderWiseAbsent(absent: any) {
    this.genderWiseAbsent = this.graphService.PieGraph('donut', " Students");
    let series = [absent.maleAbsentPercentage, absent.feMaleAbsentPercentage, absent.otherAbsentPercentage];
    this.genderWiseAbsent.series = series.map((item: any) => (item !== undefined ? Number(item == 0 ? 0 : item?.toFixed(2)) : 0));
    this.genderWiseAbsent.labels = ["Boys", "Girls", "Others"];
  }

  getGenderWiseLeave(leave: any) {
    this.genderWiseLeave = this.graphService.PieGraph('donut', " Students");
    let series = [leave.maleLeavePercentage, leave.feMaleLeavePercentage, leave.otherLeavePercentage];
    this.genderWiseLeave.series = series.map((item: any) => (item !== undefined ? Number(item == 0 ? 0 : item?.toFixed(2)) : 0));
    this.genderWiseLeave.labels = ["Boys", "Girls", "Others"];
  }

  getGenderWiseNotMarked(notMark: any) {
    this.genderWiseNotMarked = this.graphService.PieGraph('donut', " Students");
    let series = [notMark.maleNotMarkedPercentage, notMark.feMaleNotMarkedPercentage, notMark.otherNotMarkedPercentage];
    this.genderWiseNotMarked.series = series.map((item: any) => (item !== undefined ? Number(item == 0 ? 0 : item?.toFixed(2)) : 0));
    this.genderWiseNotMarked.labels = ["Boys", "Girls", "Others"];
  }


}
