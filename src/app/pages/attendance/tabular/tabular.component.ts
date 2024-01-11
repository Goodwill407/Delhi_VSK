import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommunicationService } from 'src/app/services/communication.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-tabular',
  templateUrl: './tabular.component.html',
  styleUrls: ['./tabular.component.css']
})
export class TabularComponent {
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

  constructor(private httpService: HttpServiceService, public datepipe: DatePipe, private spinner: NgxSpinnerService, private toastr: ToastrService, private communicationService: CommunicationService) {
    this.communicationServiceMobile = this.communicationService.isMobile;
  }

  ngOnInit() {
    this.dateModel = new Date();
    this.dateModel = this.getDate(this.dateModel.setDate(this.dateModel.getDate() - 1));
    this.maxDate = this.getDate(this.dateModel);
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

  getDate(date: any) {
    let Mdate: any;
    return Mdate = this.datepipe.transform(date, 'yyyy-MM-dd');
  }

  getTableData() {
    const obj: any = {
      "Z_name": this.zoneModel,
      "shift": this.shiftModel,
      "attendance_DATE": this.getDate(this.dateModel)
    }

    if (this.zoneModel && this.shiftModel) {
      this.callAPIfun(obj);
    }
    else if (this.zoneModel) {
      delete obj.shift;
      this.callAPIfun(obj);
    }
    else if (this.shiftModel) {
      delete obj.Z_name;
      this.callAPIfun(obj);
    }
    else {
      delete obj.Z_name;
      delete obj.shift;
      this.callAPIfun(obj);
    }
  }

  callAPIfun(obj: any) {
    this.spinner.show();
    this.httpService.post('tabular-attendnace', obj).subscribe(
      (res: any) => {
        this.allAttendanceData = res;
        this.allTotalData = {
          allStudent: 0, allAbsent: 0, allPresent: 0, allLeave: 0, allUnmark: 0,allPercent:0
        };
        res.forEach((school: any) => {
          this.allTotalData.allStudent += school.totalStudentCount;
          this.allTotalData.allAbsent += school.AbsentCount;
          this.allTotalData.allPresent += school.PresentCount;
          this.allTotalData.allLeave += school.totalLeaveCount;
          this.allTotalData.allUnmark += school.totalNotMarkedAttendanceCount;
          this.allTotalData.allPercent = ((this.allTotalData.allPresent / this.allTotalData.allStudent )*100).toFixed(2)
        });
        this.spinner.hide();
      },
      (error: any) => {
        this.toastr.error('', 'Something Went Wrong');
        this.spinner.hide();
      }
    );
  }
}
