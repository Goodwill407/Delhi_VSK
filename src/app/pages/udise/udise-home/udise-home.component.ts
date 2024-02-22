import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { CommunicationService } from 'src/app/services/communication.service';
import { GraphService } from 'src/app/services/graph-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-udise-home',
  templateUrl: './udise-home.component.html',
  styleUrls: ['./udise-home.component.css']
})
export class UdiseHomeComponent {

  allDistricts: any;
  districtModel: any = "";
  zoneModel: any = "";
  schoolModel: any = "";
  districtName: any;
  allSchools: any;
  allZones: any;
  studentOrientation: any;
  studentTraining: any;
  communicationServiceMobile: any;


  constructor(private httpService: HttpServiceService, private spinner: NgxSpinnerService, private route: ActivatedRoute, private graphService: GraphService, private toastr: ToastrService, private communicationService: CommunicationService) {
    this.communicationServiceMobile = this.communicationService.isMobile;
  }

  ngOnInit() {
    this.communicationService.sharedData$.subscribe(data => {
      if (data == 'home') {
        this.getAllData();
        this.getAllDistricts();
        this.getAllZones();
        this.getAllSchoolName();
      }
    });
  }


  getAllDistricts() {
    this.httpService.get('school/districtNames').subscribe((data: any) => {
      if (data && data.length > 0) {
        this.allDistricts = data;
        this.allDistricts = this.allDistricts.sort((a: any, b: any) => a.D_ID - b.D_ID);
      }
    }, (error) => {
      this.toastr.error('', 'Something went wrong !');
    })
  }

  getGraphsByDistrictName() {
    if (this.districtModel) {
      const api1 = this.httpService.get('student-orientation/get-student-orientation?district=' + this.districtModel);
      const api2 = this.httpService.get('student-training/get-student-training?district=' + this.districtModel);

      this.spinner.show();
      forkJoin([api1, api2]).subscribe(([res1, res2]) => {
        if (res1) {
          this.studentOrientationGraph(res1);
          this.studentTrainingGraph(res2);
          this.getAllZones();
          this.getAllSchoolsByDistrict();
          this.zoneModel = '';
          this.schoolModel = '';
          this.spinner.hide();
        }
      }, (error) => {
        this.spinner.hide();
        this.toastr.error('', 'Something went wrong !');
      });
    } else {
      // this.getAllTeacherData();
      this.getAllZones();
      this.allSchools = [];
      this.zoneModel = '';
      this.schoolModel = '';
    }
  }

  getGraphsByZone() {
    if (this.zoneModel) {
      this.spinner.show();
      this.httpService.get('student-orientation/get-student-orientation?zone=' + Number(this.zoneModel.slice(-2))).subscribe((data: any) => {
        if (data) {
          this.setAllGraphs(data);
          this.spinner.hide();
          this.getSchoolDataByZone();
        }
      }, (error) => {
        this.spinner.hide();
        this.toastr.error('', 'Something went wrong !');
      })
    } else {
      this.getGraphsByDistrictName();
    }
  }

  getGraphsBySchoolName() {
    this.spinner.show();
    this.httpService.get('student-orientation/get-student-orientation?SchoolID=' + this.schoolModel.Schoolid).subscribe((data: any) => {
      if (data) {
        this.setAllGraphs(data);
        this.spinner.hide();
      }
    }, (error) => {
      this.spinner.hide();
      this.toastr.error('', 'Something went wrong !');
    })
  }


  getAllZones() {
    if (this.districtModel) {
      const district = { "District_name": this.districtModel };
      this.httpService.post('school/getDistrictZone', district).subscribe((res: any) => {
        this.allZones = res.ZoneSchool;
      }, (error) => {
        this.toastr.error('', 'Something went wrong !');
      })
    } else {
      this.httpService.get('school/zonename').subscribe((res: any) => {
        this.allZones = res.ZoneInfo;
        this.allZones = this.allZones.sort((a: any, b: any) => a.Z_ID - b.Z_ID);
      }, (error) => {
        this.toastr.error('', 'Something went wrong !');
      })
    }
  }
  getAllSchoolName() {
    this.httpService.get('school/get-all-school-name').subscribe((res: any) => {
      if (res) {
        this.allSchools = res;
      } else {
        this.allSchools = [];
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
    });
  }

  getAllSchoolsByDistrict() {
    const district = {
      District_name: this.districtModel
    }
    this.spinner.show();
    this.httpService.post('school/getDistrictSchool', district).subscribe((data: any) => {
      if (data && data.districtSchools) {
        this.allSchools = data.districtSchools;
        this.allSchools = this.allSchools.sort((a: any, b: any) => a.Schoolid - b.Schoolid);
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.allSchools = [];
      }
    }, (error) => {
      this.spinner.hide();
      this.toastr.error('', 'Something went wrong !');
    })
  }

  getAllData() {
    this.spinner.show();
    const api1 = this.httpService.get('student-orientation/path-to-get-all-data?page=1');
    const api2 = this.httpService.get('student-training/path-to-get-all-data?page=1');

    forkJoin([api1, api2]).subscribe(([res1, res2]) => {
      if (res1) {
        this.studentOrientationGraph(res1.results);
        this.studentTrainingGraph(res2.results);
      }
      else {
        this.toastr.warning('Data Not Found');
      }
      this.spinner.hide();
    })
  }

  setAllGraphs(data: any) {
    this.studentOrientationGraph(data);
  }

  // --------Graphs------------//
  studentOrientationGraph(data: any) {
    this.studentOrientation = this.graphService.PieGraph('donut', 'School');
    const series = data.length;
    const labels = 'Cyber Safety'
    this.studentOrientation.series.push(series);
    this.studentOrientation.labels.push(labels);
  }
  studentTrainingGraph(data: any) {
    this.studentTraining = this.graphService.PieGraph('donut', 'School');
    const series = data.length;
    const labels = 'Training School'
    this.studentTraining.series.push(series);
    this.studentTraining.labels.push(labels);
  }
}
