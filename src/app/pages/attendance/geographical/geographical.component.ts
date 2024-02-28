import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommunicationService } from 'src/app/services/communication.service';
import { HttpServiceService } from 'src/app/services/http-service.service';
import * as L from 'leaflet';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-geographical',
  templateUrl: './geographical.component.html',
  styleUrls: ['./geographical.component.css']
})
export class GeographicalComponent {

  allAttendanceData: any;
  allSchools: any;
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
    this.communicationService.sharedData$.subscribe(data => {
      if (data == "geographical") {
        this.dateModel = new Date();
        this.dateModel.setDate(this.dateModel.getDate() - 1);
        this.getTableData();
        this.getAllDistAndZone();
        this.getAllZone();
      }
    });
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
    const api1$ = this.httpService.post('tabular-attendnace', obj);
    const api2$ = this.httpService.get('school');
    forkJoin([api1$, api2$]).subscribe(
      ([api1Data, api2Data]) => {
        this.allAttendanceData = api1Data;
        this.allSchools = api2Data;
        this.setGeographicalGraph();
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  setGeographicalGraph() {
    const mapData = L.map('map').setView([28.6139, 77.2090], 11);
    for (let i = 0; i < this.allSchools.length; i++) {
      for (let j = 0; j < this.allAttendanceData.length; j++) {
        if (this.allSchools[i].Schoolid == this.allAttendanceData[j].School_ID) {
          const mapObject = {
            School_Name: this.allSchools[i].School_Name,
            Longitude: this.allSchools[i].Longitude,
            Latitude: this.allSchools[i].Latitude,
            totalStudentCount: this.allAttendanceData[j].totalStudentCount ? this.allAttendanceData[j].totalStudentCount : 0,
            PresentCount: this.allAttendanceData[j].PresentCount ? this.allAttendanceData[j].PresentCount : 0,
            AbsentCount: this.allAttendanceData[j].AbsentCount ? this.allAttendanceData[j].AbsentCount : 0,
            totalLeaveCount: this.allAttendanceData[j].totalLeaveCount ? this.allAttendanceData[j].totalLeaveCount : 0,
            totalNotMarkedAttendanceCount: this.allAttendanceData[j].totalNotMarkedAttendanceCount ? this.allAttendanceData[j].totalNotMarkedAttendanceCount : 0,
          }
          if (this.allSchools[i].School_Name && this.allSchools[i].Longitude && this.allSchools[i].Latitude) {
            this.communicationService.allSchoolsData(mapObject, mapData);
          }
        }
      }
    }
    const map = this.communicationService.grographicalGraph(mapData);
  }
}