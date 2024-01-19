import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommunicationService } from 'src/app/services/communication.service';
import { HttpServiceService } from 'src/app/services/http-service.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-geographical',
  templateUrl: './geographical.component.html',
  styleUrls: ['./geographical.component.css']
})
export class GeographicalComponent {

  allAttendanceData: any;
  allSchools: any;
  districtModel: any = '';
  zoneModel: any = '';
  allZones: any;
  allShift: any = ['Morning', 'General', 'Evening'];
  shiftModel: any = '';
  dateModel: any;
  communicationServiceMobile: any;
  allDistricts: any;
  allStudent: any = 0;
  mapData: any;

  constructor(private httpService: HttpServiceService, public datepipe: DatePipe, private spinner: NgxSpinnerService, private toastr: ToastrService, private communicationService: CommunicationService) {
    this.communicationServiceMobile = this.communicationService.isMobile;
  }


  ngOnInit() {
    this.communicationService.sharedData$.subscribe(data => {
      if (data == "geographical") {
        this.dateModel = new Date();
        this.dateModel.setDate(this.dateModel.getDate() - 1);
        this.getTableData('');
        this.getAllDistricts();
        this.getAllZone();
        this.mapData = L.map('map').setView([28.6139, 77.2090], 11);
      }
    });
  }

  mapClick() {
    this.spinner.show();
    const previousDistrict = sessionStorage.getItem('DistrictName');
    setTimeout(() => {
      const name = sessionStorage.getItem('DistrictName');
      if (previousDistrict != name) {
        this.districtModel = name;
        this.getTableData('district');
      }
    }, 1000)
  }

  getAllZone() {
    this.httpService.get('school/zonename').subscribe((res: any) => {
      this.allZones = res.ZoneInfo;
      this.allZones = this.allZones.sort((a: any, b: any) => a.Z_ID - b.Z_ID);
    })
  }

  getAllDistricts() {
    this.httpService.get('school/districtNames').subscribe((res: any) => {
      this.allDistricts = res;
      this.allDistricts = this.allDistricts.sort((a: any, b: any) => a.D_ID - b.D_ID)
    }, (error: any) => {
      this.toastr.error();
    })
  }

  getDistrictWiseZones() {
    const district = { "District_name": this.districtModel };
    this.httpService.post('school/getDistrictZone', district).subscribe((res: any) => {
      this.allZones = res.ZoneSchool;
    }, (error: any) => {
      this.toastr.error();
    })
  }

  getDate(date: any) {
    let Mdate: any;
    return Mdate = this.datepipe.transform(date, 'yyyy-MM-dd');
  }

  getTableData(event: any) {
    const obj: any = {
      district_name: this.districtModel,
      "Z_name": this.zoneModel,
      "shift": this.shiftModel,
      "attendance_DATE": this.getDate(this.dateModel)
    }

    if (event == 'district') {
      delete obj.Z_name;
      delete obj.shift;
      this.zoneModel = '';
      this.shiftModel = '';
      this.getDistrictWiseZones();
    } else if (event == 'zone') {
      delete obj.shift;
      this.shiftModel = '';
    }
    this.callAPIfun(obj);
  }

  callAPIfun(obj: any) {
    this.spinner.show();
    this.httpService.post('tabular-attendnace', obj).subscribe((res: any) => {
      this.allAttendanceData = res;
      this.spinner.hide();
      this.setGeographicalGraph();
    },
      error => {
        this.spinner.hide();
      })
  }

  setGeographicalGraph() {
    var isLayersEmpty = Object.keys(this.mapData._layers).length === 0;
    if (!isLayersEmpty) {
      for (var key in this.mapData._layers) {
        if (this.mapData._layers.hasOwnProperty(key)) {
          var currentInstance = this.mapData._layers[key];
          this.mapData.removeLayer(currentInstance);
        }
      }
    }
    for (let j = 0; j < this.allAttendanceData.length; j++) {
      if (this.allAttendanceData[j].school_name && this.allAttendanceData[j].Longitude && this.allAttendanceData[j].Latitude) {
        this.communicationService.allSchoolsData(this.allAttendanceData[j], this.mapData, L);
      }
    }
    const map = this.communicationService.grographicalGraph(this.mapData, L);
  }
}
