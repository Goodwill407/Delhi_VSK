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
  allShift: any = ['Morning', 'General', 'Evening'];
  shiftModel: any = '';
  dateModel: any;
  communicationServiceMobile: any;
  allDist: any;
  allStudent: any = 0;
  constructor(private httpService: HttpServiceService, public datepipe: DatePipe, private spinner: NgxSpinnerService, private toastr: ToastrService, private communicationService: CommunicationService) {
    this.communicationServiceMobile = this.communicationService.isMobile;
  }

  ngOnInit() {
    this.dateModel = new Date();
    this.dateModel.setDate(this.dateModel.getDate() - 1);
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
    // return Mdate = this.datepipe.transform(date, 'dd/MM/yyyy');
    return Mdate = this.datepipe.transform(date, 'yyyy-MM-dd');
  }

  getTableData() {
    const obj: any = {
      "Z_name": this.zoneModel,
      // "School_ID": "",
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
    this.httpService.post('tabular-attendnace', obj).subscribe(
      (res: any) => {
        this.allAttendanceData = res;
        res.forEach((school: any) => {
          this.allStudent += school.totalStudentCount;
        });
      },
      (error: any) => {
        this.toastr.error('', 'Something Went Wrong');
      }
    );
  }
}
