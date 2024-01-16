import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommunicationService } from 'src/app/services/communication.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-tabular-school',
  templateUrl: './tabular-school.component.html',
  styleUrls: ['./tabular-school.component.css']
})
export class TabularSchoolComponent {
  allSchoolData: any;
  zoneModel: any = '';
  allZones: any;
  allSchool: any;
  schoolModel: any = "";
  communicationServiceMobile: any;
  allDist: any;
  allTotalData: any = {};
  maxDate: any = '2024-08-28';

  constructor(private httpService: HttpServiceService, public datepipe: DatePipe, private spinner: NgxSpinnerService, private toastr: ToastrService, private communicationService: CommunicationService) {
    this.communicationServiceMobile = this.communicationService.isMobile;
  }

  ngOnInit() {
    this.getTableData();
    this.getAllDistAndZone();
    this.getAllZone();
  }

  getAllZone() {
    this.httpService.get('school/zonename').subscribe((res: any) => {
      this.allZones = res.ZoneInfo;
      this.allZones = this.allZones.sort((a: any, b: any) => a.Z_ID - b.Z_ID);
    })
  }

  getAllDistAndZone() {
    this.httpService.get('tabular-attendnace/get-district').subscribe((res: any) => {
      this.allDist = res;
    }, (error: any) => {
      this.toastr.error();
    })
  }

  getAllSchoolName() {
    this.httpService.get('school/get-all-school-name').subscribe((res: any) => {
      if (res) {
        this.allSchool = res;
      } else {
        this.allSchool = [];
      }
    })
  }

  getSchoolDataByZone() {
    const zone = {
      Zone_Name: this.zoneModel
    }
    this.spinner.show();
    this.httpService.post('school/getZoneSchool', zone).subscribe((data: any) => {
      if (data && data.ZoneSchool) {
        this.allSchool = data.ZoneSchool;
        this.allSchool = this.allSchool.sort((a: any, b: any) => a.Schoolid - b.Schoolid);
        this.spinner.hide();
      } else {
        this.allSchool = [];
        this.spinner.hide();
      }
    }, (error) => {
      this.spinner.hide();
      this.toastr.error('', 'Something went wrong !');
    })
  }

  getTableData() {
   if(this.zoneModel){
      this.getGraphsByZone();
    }
    else if(this.schoolModel){
      this.getGraphsBySchoolName();
    }
    else{
      this.allTotalCount();
    }
  }

  allTotalCount() {
    this.spinner.show();
    this.httpService.get('graphs/school-teacher-student-graph').subscribe((data: any) => {
      if (data) {
        this.allSchoolData = data;
        this.spinner.hide();
      }
    }, (error) => {
      this.spinner.hide();
      this.toastr.error('', 'Something went wrong !');
    })
  }

  getGraphsByZone() {
    if (this.zoneModel) {
      const zone = { zoneName: this.zoneModel };
      this.spinner.show();
      this.httpService.post('zonegraph/school-student-teacher-graph-zonename', zone).subscribe(
        (res: any) => {
          if (res) {
            this.allSchoolData = res;
            this.getSchoolDataByZone();
          }
        }, (error: any) => {
          this.toastr.error('', 'Something Went Wrong...!')
        })
    } else {
      this.allTotalCount();
    }
  }


  getGraphsBySchoolName() {
    this.spinner.show();
    if (this.schoolModel) {
      const school = {
        "schoolId": this.schoolModel.Schoolid
      }
      this.spinner.show();
      this.httpService.post('zonegraph/school-student-teacher-graph-schoolid', school).subscribe(
        (res: any) => {
          this.allSchoolData = res;
        }, (error: any) => {
          this.toastr.error('', 'Something Went Wrong...!');
        }
      );


    }
  }

  callAPIfun(obj: any) {
    this.spinner.show();
    this.httpService.post('tabular-attendnace', obj).subscribe(
      (res: any) => {
        this.allSchoolData = res;
        // this.allTotalData = {
        //   allStudent: 0, allAbsent: 0, allPresent: 0, allLeave: 0, allUnmark: 0,allPercent:0
        // };
        // res.forEach((school: any) => {
        //   this.allTotalData.allStudent += school.totalStudentCount;
        //   this.allTotalData.allAbsent += school.AbsentCount;
        //   this.allTotalData.allPresent += school.PresentCount;
        //   this.allTotalData.allLeave += school.totalLeaveCount;
        //   this.allTotalData.allUnmark += school.totalNotMarkedAttendanceCount;
        //   this.allTotalData.allPercent = ((this.allTotalData.allPresent / this.allTotalData.allStudent )*100).toFixed(2)
        // });
        // this.spinner.hide();
      },
      (error: any) => {
        this.toastr.error('', 'Something Went Wrong');
        this.spinner.hide();
      }
    );
  }
}

