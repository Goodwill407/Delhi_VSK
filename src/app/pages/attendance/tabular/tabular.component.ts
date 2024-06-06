import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommunicationService } from 'src/app/services/communication.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-tabular',
  templateUrl: './tabular.component.html',
  styleUrls: ['./tabular.component.css']
})
export class TabularComponent implements OnInit {
  allAttendanceData: any;
  zoneModel: any = '';
  allZones: any;
  allShift: string[] = ['Morning', 'General', 'Evening'];
  shiftModel: any = '';
  dateModel: any;
  communicationServiceMobile: any;
  allDist: any;
  allTotalData: any = {};
  maxDate: any = '2024-08-28';
  user: any;

  constructor(private httpService: HttpServiceService, public datepipe: DatePipe, private spinner: NgxSpinnerService, private toastr: ToastrService, private communicationService: CommunicationService, private cdRef: ChangeDetectorRef) {
    this.communicationServiceMobile = this.communicationService.isMobile;
    this.user = JSON.parse(sessionStorage.getItem('userProfile')!);
  }

  ngOnInit() {
    this.communicationService.sharedData$.subscribe(data => {
      if (data == "tabular") {
        this.dateModel = new Date();
        this.dateModel = this.getDate(this.dateModel.setDate(this.dateModel.getDate()));
        this.maxDate = this.getDate(this.dateModel);
        this.setRoleWiseDropdowns();
        this.getAllDistAndZone();
        this.getAllZones();
        this.getTableData();
      }
    });
  }

  setRoleWiseDropdowns() {
    if (this.user.role == 'zone') {
      this.zoneModel = this.user.assignedTO;
      this.getTableData();
    }
  }

  // getAllZones() {
  //   this.httpService.get('school/zonename').subscribe((res: any) => {
  //     this.allZones = res.ZoneInfo;
  //     this.allZones = this.allZones.sort((a: any, b: any) => a.Z_ID - b.Z_ID);
  //     this.zoneModel = this.allZones[0];
  //   })
  // }
  getAllZones() {
    if (this.user.role == 'district') {
      const district = { "District_name": this.user.assignedTO };
      this.httpService.post('school/getDistrictZone', district).subscribe((res: any) => {
        this.allZones = res.ZoneSchool;
        this.allZones = this.allZones.sort((a: any, b: any) => a.Z_ID - b.Z_ID);
        this.zoneModel = this.allZones[0];
      })
    } else {
      this.httpService.get('school/zonename').subscribe((res: any) => {
        this.allZones = res.ZoneInfo;
        this.allZones = this.allZones.sort((a: any, b: any) => a.Z_ID - b.Z_ID);
        this.zoneModel = this.allZones[0];
      })
    }
  }

  getAllDistAndZone() {
    this.httpService.get('tabular-attendnace/get-district').subscribe((res: any) => {
      this.allDist = res;
    }, (error: any) => {
      this.toastr.error();
    })
  }

  getDate(date: any) {
    let Mdate: any;
    return Mdate = this.datepipe.transform(date, 'yyyy-MM-dd');
  }

  getTableData() {
    const obj: any = {
      "Z_name": this.zoneModel.Zone_Name,
      "attendance_DATE": this.getDate(this.dateModel),
      "shift": this.shiftModel,
    }

    this.callAPIfun(obj);
  }

  callAPIfun(obj: any) {
    this.spinner.show();
    this.httpService.post('tabular-attendnace', obj).subscribe(
      (res: any) => {
        // if(this.shiftModel){
        //  this.allAttendanceData = res.filter((item:any)=>{

        //   console.log(item.shift, this.shiftModel);
        //   return  item.shift.toLowerCase() === this.shiftModel;

        // });
        // }else{
        //   this.allAttendanceData = res;
        // }
        this.allAttendanceData = res;

        for (let i = 0; i < this.allAttendanceData.length; i++) {
          this.allAttendanceData[i].percent = (this.allAttendanceData[i].totalNotMarkedAttendanceCount / this.allAttendanceData[i].totalStudentCount) * 100;
        }

        this.allTotalData = {
          allStudent: 0, allStudyingStudent: 0, allAbsent: 0, allPresent: 0, allLeave: 0, allUnmark: 0, allPercent: 0
        };
        res.forEach((school: any) => {
          this.allTotalData.allStudent += school.totalStudentCount;
          // this.allTotalData.allStudyingStudent += school.studyingStudentCount;
          this.allTotalData.allAbsent += school.AbsentCount;
          this.allTotalData.allPresent += school.PresentCount;
          this.allTotalData.allLeave += school.totalLeaveCount;
          this.allTotalData.allUnmark += school.totalNotMarkedAttendanceCount;
          this.allTotalData.allPercent = ((this.allTotalData.allUnmark / this.allTotalData.allStudent) * 100).toFixed(2)
        });
        this.spinner.hide();
      },
      (error: any) => {
        this.toastr.error('', 'Something Went Wrong');
        this.spinner.hide();
      }
    );
  }

  dataByShift() {
    if (this.shiftModel) {

    } else {

    }
  }

  exportToExcel(): void {
    this.communicationService.exportToExcel(this.allAttendanceData, 'data', 'Sheet1');
  }
}
