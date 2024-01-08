import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommunicationService } from 'src/app/services/communication.service';
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
  dateRangeGraph: any;

  allDistricts: any;
  allSchools: any;
  districtModel: any = "";
  shiftModel: any = "";
  schoolModel: any = "";
  zoneModel: any = "";
  dateModel1: any;
  dateModel2: any;
  allZones: any;
  districtName: any;
  schoolName: any;
  DateWiseRange: any;
  allShift: any = ['Morning', 'General', 'Evening'];
  dataNotFound: boolean = false;
  communicationServiceMobile: any;

  constructor(private toastr: ToastrService, private httpService: HttpServiceService, public datepipe: DatePipe, private spinner: NgxSpinnerService, private graphService: GraphService, private communicationService: CommunicationService) {
    this.communicationServiceMobile = this.communicationService.isMobile;
  }


  ngOnInit() {
    this.getAllDistricts();
    this.getAllZones();
  }

  getAllDistricts() {
    // this.spinner.show();
    this.httpService.get('school/districtNames').subscribe((data: any) => {
      if (data && data.length > 0) {
        this.allDistricts = data;
        this.allDistricts = this.allDistricts.sort((a: any, b: any) => a.D_ID - b.D_ID);
        // this.spinner.hide();
      }
    }, (error) => {
      // this.spinner.hide();
      this.toastr.error('', 'Something went wrong !');
    });
  }

  getGraphsByShift() {
    let obj: any = {
      "startDate": this.getDate(this.dateModel1),
      "endDate": this.getDate(this.dateModel2),
      "zoneName": this.zoneModel,
      "districtName": this.districtModel,
      "shift": this.shiftModel,
    };
    if(this.zoneModel){
      delete obj.districtName;
    }else{
      delete obj.zoneName;
    }
    if(!this.districtModel){
      delete obj.districtName
    }

    this.spinner.show();
    this.httpService.post('attendance/attendancepercentage/range/parameter/shift', obj).subscribe(res => {
      this.setAllGraphs(res);
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      this.toastr.error('', 'Something went wrong !');
    })
  }

  getGraphsByDistrictName() {
    if (this.districtModel) {
      this.getAllZones();
      this.getAllSchools();
      this.zoneModel = '';
      this.schoolModel = '';
      this.shiftModel = '';
      this.datePicker();
    } else {
      this.getAllZones();
      this.allSchools = [];
      this.datePicker();
      this.zoneModel = '';
      this.schoolModel = '';
      this.shiftModel = '';
    }
  }

  getDate(date: any) {
    let Mdate: any;
    // return Mdate = this.datepipe.transform(date, 'dd/MM/yyyy');
    return Mdate = this.datepipe.transform(date, 'yyyy-MM-dd');
  }

  datePicker() {
    if(this.dateModel1 && this.dateModel2 && this.shiftModel){
      this.getGraphsByShift();
    }
    else if(this.dateModel1 && this.dateModel2) {
      const obj: any = {
        "startDate": this.getDate(this.dateModel1),
        "endDate": this.getDate(this.dateModel2),
        "zoneName": this.zoneModel,
        "districtName": this.districtModel
      };

      if (this.schoolModel) {
        obj.schoolId = String(this.schoolModel.Schoolid);
      }
      if (!this.districtModel) {
        delete obj.districtName;
      }
      if (!this.zoneModel) {
        delete obj.zoneName;
      };
      this.spinner.show();
      this.httpService.post('attendance/attendancepercentage/range/parameter', obj).subscribe((res: any) => {
        if (res.dateWisePercentage.length > 0) {
          this.shiftModel = '';
          this.setAllGraphs(res);
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.toastr.error('', 'Data not found between this range !');
          if (!this.genderWisePresent && !this.genderWiseAbsent && !this.genderWiseLeave && !this.genderWiseNotMarked) {
            this.dataNotFound = true;
          }
        }
      }, (error) => {
        this.spinner.hide();
        this.toastr.error('', 'Something went wrong !');
      });
    }
  }

  getAllZones() {
    if (this.districtModel) {
      this.spinner.show();
      const district = { "District_name": this.districtModel };
      this.httpService.post('school/getDistrictZone', district).subscribe((res: any) => {
        this.allZones = res.ZoneSchool;
        this.allZones = this.allZones.sort((a: any, b: any) => a.Z_ID - b.Z_ID);
        this.shiftModel = '';
        this.spinner.hide();
      }, (error) => {
        this.toastr.error('', 'Something went wrong !');
        this.spinner.hide();
      });
    } else {
      // this.spinner.show();
      this.httpService.get('school/zonename').subscribe((res: any) => {
        this.allZones = res.ZoneInfo;
        this.allZones = this.allZones.sort((a: any, b: any) => a.Z_ID - b.Z_ID);
        this.shiftModel = '';
        // this.spinner.hide();
      }, (error) => {
        this.toastr.error('', 'Something went wrong !');
        // this.spinner.hide();
      });
    }
  }

  getGraphsByZone() {
    this.getSchoolDataByZone();
    this.datePicker();
  }

  getSchoolDataByZone() {
    const zone = {
      Zone_Name: this.zoneModel
    }
    this.spinner.show();
    this.httpService.post('school/getZoneSchool', zone).subscribe((data: any) => {
      if (data && data.ZoneSchool) {
        this.allSchools = data.ZoneSchool;
        this.allSchools = this.allSchools.sort((a: any, b: any) => a.Schoolid - b.Schoolid);
        this.schoolModel = ''
        this.spinner.hide();
      } else {
        this.allSchools = [];
        this.spinner.hide();
      }
    }, (error) => {
      this.spinner.hide();
      this.toastr.error('', 'Something went wrong !');
    })
  }

  getAllSchools() {
    this.spinner.show();
    const district = {
      District_name: this.districtModel
    }
    this.httpService.post('school/getDistrictSchool', district).subscribe((data: any) => {
      if (data && data.districtSchools) {
        this.allSchools = data.districtSchools;
      } else {
        this.allSchools = [];
      }
      this.spinner.hide();
    }, (error) => {
      this.spinner.hide();
      this.toastr.error('', 'Something went wrong !');
    })
  }

  getGraphsBySchoolName() {
    this.datePicker();
  }

  setAllGraphs(data: any) {
    this.getGenderWiseAbsent(data.overallPercentage);
    this.getGenderWiseLeave(data.overallPercentage);
    this.getGenderWisePresent(data.overallPercentage);
    this.getGenderWiseNotMarked(data.overallPercentage);
    this.getDateRangeGraph(data.dateWisePercentage)
  }

  getGenderWisePresent(present: any) {
    this.genderWisePresent = this.graphService.PieGraph('donut', "Students");
    let series = [present.malePresentPercentage, present.feMalePresentPercentage, present.otherPresentPercentage];
    this.genderWisePresent.series = series.map((item: any) => (item !== undefined ? Number(item == 0 ? 0 : item?.toFixed(2)) : 0));
    this.genderWisePresent.labels = ["Boys", "Girls", "Others"];
  }

  getGenderWiseAbsent(absent: any) {
    this.genderWiseAbsent = this.graphService.PieGraph('donut', "Students");
    let series = [absent.maleAbsentPercentage, absent.feMaleAbsentPercentage, absent.otherAbsentPercentage];
    this.genderWiseAbsent.series = series.map((item: any) => (item !== undefined ? Number(item == 0 ? 0 : item?.toFixed(2)) : 0));
    this.genderWiseAbsent.labels = ["Boys", "Girls", "Others"];
  }

  getGenderWiseLeave(leave: any) {
    this.genderWiseLeave = this.graphService.PieGraph('donut', "Students");
    let series = [leave.maleLeavePercentage, leave.feMaleLeavePercentage, leave.otherLeavePercentage];
    this.genderWiseLeave.series = series.map((item: any) => (item !== undefined ? Number(item == 0 ? 0 : item?.toFixed(2)) : 0));
    this.genderWiseLeave.labels = ["Boys", "Girls", "Others"];
  }

  getGenderWiseNotMarked(notMark: any) {
    this.genderWiseNotMarked = this.graphService.PieGraph('donut', "Students");
    let series = [notMark.maleNotMarkedPercentage, notMark.feMaleNotMarkedPercentage, notMark.otherNotMarkedPercentage];
    this.genderWiseNotMarked.series = series.map((item: any) => (item !== undefined ? Number(item == 0 ? 0 : item?.toFixed(2)) : 0));
    this.genderWiseNotMarked.labels = ["Boys", "Girls", "Others"];
  }

  getDateRangeGraph(data: any) {
    this.DateWiseRange = data
    console.log(this.DateWiseRange.length)
    this.dateRangeGraph = this.graphService.districtWiseGraph();
    this.dateRangeGraph.series[0].name = "Present";
    this.dateRangeGraph.series[1].name = "Absent";
    this.dateRangeGraph.series[2].name = "Leave";
    this.dateRangeGraph.series[3].name = "Not Mark";
    for (let i = 0; i < data.length; i++) {
      this.dateRangeGraph.series[0].data.push(Number((data[i].malePresentPercentage + data[i].feMalePresentPercentage + data[i].otherPresentPercentage).toFixed(2)));
      this.dateRangeGraph.series[1].data.push(Number((data[i].maleAbsentPercentage + data[i].feMaleAbsentPercentage + data[i].otherAbsentPercentage).toFixed(2)));
      this.dateRangeGraph.series[2].data.push(Number((data[i].maleLeavePercentage + data[i].femaleLeavePercentage + data[i].otherLeavePercentage).toFixed(2)));
      this.dateRangeGraph.series[3].data.push(Number((data[i].maleNotMarkedPercentage + data[i].femaleNotMarkedPercentage + data[i].otherNotMarkedPercentage).toFixed(2)));
      this.dateRangeGraph.xaxis.categories.push(data[i].attendance_DATE.substring(0, 10));
    }
  }
}
