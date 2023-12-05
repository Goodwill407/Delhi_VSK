import { DatePipe } from '@angular/common';
import { Component, SimpleChange, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommunicationService } from 'src/app/services/communication.service';
import { GraphService } from 'src/app/services/graph-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-attendance-regular',
  templateUrl: './attendance-regular.component.html',
  styleUrls: ['./attendance-regular.component.css']
})
export class AttendanceRegularComponent {
  // Graphs
  teacherGenderRatio: any;
  studentsGenderRatio: any;
  districtWiseGraph: any;
  lowClassHighClass: any;
  allZones: any;
  streamCount: any;
  minorityCount: any;

  // Single data
  allData: any;
  allDistricts: any;
  allSchools: any;
  districtModel: any = "";
  zoneModel: any = "";
  shiftModel: any = "";
  schoolModel: any = "";
  dateModel: any;
  districtName: any;
  allSchoolAttendanceStatus: any;

  // Graphs
  genderWisePresent: any;
  genderWiseAbsent: any;
  genderWiseLeave: any;
  genderWiseNotMarked: any;
  attendanceStatusCount: any;
  indexNoConfig: any;
  districtWiseTopFiveGraph: any;
  zoneWiseTopFiveGraph: any;
  schoolWiseTopFiveGraph: any;
  districtWiseBottomFiveGraph: any;
  zoneWiseBottomFiveGraph: any;
  schoolWiseBottomFiveGraph: any;

  allShift: any = ['Morning', 'General', 'Evening'];
  districtWiseAttendanceCount: any;
  newDate: any
  @ViewChild('openModal') openModal: any;
  formattedDate: any;
  itemCount: number | undefined;
  subscription: Subscription | undefined;


  constructor(private communicationService: CommunicationService, private httpService: HttpServiceService, private spinner: NgxSpinnerService, private route: ActivatedRoute, private graphService: GraphService, public datepipe: DatePipe, private toastr: ToastrService) {

  }

  ngOnInit() {
    this.dateModel = new Date();
    this.dateModel.setDate(this.dateModel.getDate() - 1);
    this.formattedDate = this.datepipe.transform(this.dateModel, 'dd-MMM-yyyy');
    this.getGraphsByDate(true);
    this.getAllDistricts();
    this.getAllZones();

    this.subscription = this.graphService
      .getItemCountObservable()
      .subscribe((count) => {
        this.itemCount = count;
        if (this.itemCount && this.indexNoConfig == this.indexNoConfig || 0) {
          this.getAttendanceStatusCountClick(false);
        }
      });
  }

  handleParentClick() {
    this.communicationService.emitParentClick();
  }

  getDate(date: any) {
    let Mdate: any;
    return Mdate = this.datepipe.transform(date, 'dd/MM/yyyy');
  }

  getAllDistricts() {
    this.httpService.get('graphs/school-student-count-by-district').subscribe((data: any) => {
      if (data && data.length > 0) {
        this.allDistricts = data;
        this.allDistricts = this.allDistricts.sort((a: any, b: any) => a.D_ID - b.D_ID);
      }
    })
  }

  getAllZones() {
    if (this.districtModel) {
      const district = { "District_name": this.districtModel };
      this.httpService.post('school/getDistrictZone', district).subscribe((res: any) => {
        this.allZones = res.ZoneSchool;
        this.allZones = this.allZones.sort((a: any, b: any) => a.Z_ID - b.Z_ID);
        this.getAllSchools();
      })
    } else {
      this.httpService.get('school/zonename').subscribe((res: any) => {
        this.allZones = res.ZoneInfo;
        this.allZones = this.allZones.sort((a: any, b: any) => a.Z_ID - b.Z_ID);
        this.getAllSchools();
      })
    }
  }

  getGraphsByZone() {
    if (this.zoneModel == "") {
      this.getGraphsByDate(false);
    } else {
      this.spinner.show();
      const zone = {
        date: this.getDate(this.dateModel),
        zoneName: this.zoneModel
      }
      this.httpService.post('attendance/zone/date-wise', zone).subscribe((data: any) => {
        if (data && data.Counts.length > 0) {
          this.setAllGraphs(data);
          this.getAllSchools();
          this.shiftModel = '';
        } else {
          this.toastr.error('Data not found for this zone or date')
        }
        this.spinner.hide();
      }, (error) => {
        this.spinner.hide();
      })
    }
  }

  getGraphsByDistrictName() {
    if (this.districtModel == "") {
      this.getGraphsByDate(false);
    } else {
      this.spinner.show();
      const district = {
        "date": this.getDate(this.dateModel),
        "districtName": this.districtModel
      }
      this.httpService.post('attendance/district-wise/date-wise', district).subscribe((data: any) => {
        if (data && data.Counts.length > 0) {
          this.zoneModel = '';
          this.shiftModel = '';
          this.setAllGraphs(data);
          this.getAllZones();
          this.getAllSchools();
        } else {
          this.toastr.error('', 'Data not found for this district or date')
        }
        this.spinner.hide();
      }, (error) => {
        this.spinner.hide();
      });
    }
  }

  getAllSchools() {
    if (this.districtModel && !this.zoneModel) {
      const district = {
        District_name: this.districtModel
      }
      this.httpService.post('school/getDistrictSchool', district).subscribe((data: any) => {
        if (data && data.districtSchools) {
          this.allSchools = data.districtSchools;
          this.allSchools = this.allSchools.sort((a: any, b: any) => a.Schoolid - b.Schoolid);
        } else {
          this.allSchools = [];
        }
      });
    } else if (this.zoneModel) {
      const zone = {
        Zone_Name: this.zoneModel
      }
      this.httpService.post('school/getZoneSchool', zone).subscribe((data: any) => {
        if (data && data.ZoneSchool) {
          this.allSchools = data.ZoneSchool;
          this.allSchools = this.allSchools.sort((a: any, b: any) => a.Schoolid - b.Schoolid);
          this.schoolModel = ''
        } else {
          this.allSchools = [];
        }
      });
    }
  }

  getGraphsByDate(onload: boolean) {
    // this.formattedDate = this.datepipe.transform(this.dateModel, 'dd-MMM-yyyy');
    if (this.districtModel && !this.zoneModel && !this.schoolModel) {
      this.getGraphsByDistrictName();
    } else if (this.zoneModel && !this.schoolModel) {
      this.getGraphsByZone();
    } else if (this.shiftModel) {
      this.getGraphsBySfhit();
    } else if (this.schoolModel) {
      this.getGraphsBySchool();
    } else {
      this.spinner.show();
      let date = { "date": this.getDate(this.dateModel) };
      this.httpService.post('attendance/date-wise', date).subscribe((data) => {
        if (data.Counts && data.Counts.length == 0 && onload) {
          this.dateModel.setDate(this.dateModel.getDate() - 1);
          this.getGraphsByDate(true);
        } else if (data.Counts && data.Counts.length == 0 && !onload) {
          this.toastr.error('', 'Data not found for this date')
        } else {
          this.setAllGraphs(data);
          this.formattedDate = this.datepipe.transform(this.dateModel, 'dd-MMM-yyyy');
          this.dateModel = this.formattedDate;
        }
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
      }
      );
    }
  }

  getGraphsBySfhit() {
    if (this.shiftModel == "") {
      this.getGraphsByDate(false);
    } else {
      this.spinner.show();
      const shift = {
        "shift": this.shiftModel,
        "date": this.getDate(this.dateModel)
      }
      this.httpService.post('attendance/zone/shift/wise', shift).subscribe((data: any) => {
        if (data && data.Counts.length > 0) {
          this.setAllGraphs(data);
          this.districtModel = '';
          this.zoneModel = '';
          this.getAllZones();
        } else {
          this.toastr.error('', 'Data not found for this shift or date')
        }
        this.spinner.hide();
      }, (error) => {
        this.spinner.hide();
      });
    }
  }

  getGraphsBySchool() {
    if (this.schoolModel == "") {
      this.getGraphsByDate(false);
    } else {
      this.spinner.show();
      const school = {
        "School_ID": String(this.schoolModel.Schoolid),
        "date": this.getDate(this.dateModel)
      }
      this.httpService.post('attendance/school/date-wise', school).subscribe((data: any) => {
        if (data && data.Counts.length > 0) {
          this.setAllGraphs(data);
          this.shiftModel = '';
        } else {
          this.toastr.error('', 'Data not found for this school or date')
        }
        this.spinner.hide();
      }, (error) => {
        this.spinner.hide();
      });
    }
  }

  setAllGraphs(data: any) {
    this.allData = data;
    this.getGenderWisePresent(data);
    this.getGenderWiseAbsent(data);
    this.getGenderWiseLeave(data);
    this.getGenderWiseNotMarked(data);
    this.getAttendanceStatusCount(data.statusCounts);
    this.setDistrictWiseGraph();
    if (!this.zoneModel && !this.districtModel) {
      this.districtWiseTopFive();
      this.districtWiseBottomFive();
    } else if (this.districtModel && !this.zoneModel) {
      this.zoneWiseTopFive();
      this.zoneWiseBottomFive();
    } else if (this.zoneModel) {
      this.schoolWiseTopFive();
      this.schoolWiseBottomFive();
    }
  }

  getGenderWisePresent(data: any) {
    this.genderWisePresent = this.graphService.PieGraph('donut', ' Students');
    this.genderWisePresent.series = [data.Counts[0].malePresentCount, data.Counts[0].feMalePresentCount, data.Counts[0].otherPresentCount];
    this.genderWisePresent.labels = ['Male', 'Female', 'Others']
  }

  getGenderWiseAbsent(data: any) {
    this.genderWiseAbsent = this.graphService.PieGraph('donut', ' Students');
    this.genderWiseAbsent.series = [data.Counts[0].maleAbsentCount, data.Counts[0].feMaleAbsentCount, data.Counts[0].othersAbsentCount];
    this.genderWiseAbsent.labels = ['Male', 'Female', 'Others'];
  }

  getGenderWiseLeave(data: any) {
    this.genderWiseLeave = this.graphService.PieGraph('donut', ' Students');
    this.genderWiseLeave.series = [data.Counts[0].maleLeaveCount, data.Counts[0].femaleLeaveCount, data.Counts[0].otherLeaveCount];
    this.genderWiseLeave.labels = ['Male', 'Female', 'Others'];
  }

  getGenderWiseNotMarked(data: any) {
    this.genderWiseNotMarked = this.graphService.PieGraph('donut', ' Students');
    this.genderWiseNotMarked.series = [data.Counts[0].maleAttendanceNotMarked, data.Counts[0].femaleAttendanceNotMarked, data.Counts[0].otherAttendanceNotMarked];
    this.genderWiseNotMarked.labels = ['Male', 'Female', 'Others'];
  }

  getAttendanceStatusCount(data: any) {
    this.attendanceStatusCount = this.graphService.PieGraph('donut', ' School');
    for (let i = 0; i < data.length; i++) {
      this.attendanceStatusCount.series.push(data[i].count);
      this.attendanceStatusCount.labels.push(data[i]._id);
    }
    this.attendanceStatusCount.chart.events = {
      dataPointSelection: (event: any, chartContext: any, config: any) => {
        this.indexNoConfig = config.dataPointIndex;
        this.getAttendanceStatusCountClick(true);
        this.graphService.addToCart();
      }
    }
  }

  getAttendanceStatusCountClick(flash: any) {
    let parameter: any = {
      "attendanceStatus": this.attendanceStatusCount.labels[this.indexNoConfig],
      "date": this.getDate(this.dateModel),
    }
    if (this.dateModel && !this.schoolModel && !this.districtModel && !this.zoneModel && !this.shiftModel) {
      this.getDataOfCommon(true,'attendance/attendance-status-wise',parameter);
      // this.httpService.post('attendance/attendance-status-wise', parameter).subscribe((res: any) => {
      //   this.allSchoolAttendanceStatus = res;
      //   if (!flash) {
      //     this.openModal.nativeElement.click();
      //   }
      // })
    } else if (!this.schoolModel && this.districtModel && !this.zoneModel) {
      parameter.district_name = this.districtModel;
      this.getDataOfCommon(true,'attendance/attendance-status-shift-wise',parameter);
      // this.httpService.post('attendance/attendance-status-district-wise', parameter).subscribe((res: any) => {
      //   this.allSchoolAttendanceStatus = res;
      //   if (!flash) {
      //     this.openModal.nativeElement.click();
      //   }
      // })
    } else if (!this.schoolModel && this.zoneModel) {
      parameter.Z_name = this.zoneModel;
      this.getDataOfCommon(true,'attendance/attendance-status-zone-wise',parameter);
      // this.httpService.post('attendance/attendance-status-zone-wise', parameter).subscribe((res: any) => {
      //   this.allSchoolAttendanceStatus = res;
      //   if (!flash) {
      //     this.openModal.nativeElement.click();
      //   }
      // })
    } else if (this.schoolModel) {
      parameter.School_ID = this.schoolModel.Schoolid;
      this.getDataOfCommon(true,'attendance/attendance-status-school-wise',parameter);
      // this.httpService.post('attendance/attendance-status-school-wise', parameter).subscribe((res: any) => {
      //   this.allSchoolAttendanceStatus = res;
      //   if (!flash) {
      //     this.openModal.nativeElement.click();
      //   }
      // })
    } else if (this.dateModel && this.shiftModel) {
      parameter.shift = this.shiftModel;
      this.getDataOfCommon(true,'attendance/attendance-status-shift-wise',parameter);
      // this.httpService.post('attendance/attendance-status-shift-wise', parameter).subscribe((res: any) => {
      //   this.allSchoolAttendanceStatus = res;
      //   if (!flash) {
      //     this.openModal.nativeElement.click();
      //   }
      // })
    }
  }

  getDataOfCommon(flash:any,apiPath:any,parameter:any){
    this.httpService.post(apiPath, parameter).subscribe((res: any) => {
      this.allSchoolAttendanceStatus = res;
      if (!flash) {
        this.openModal.nativeElement.click();
      }
    })
  }

  setDistrictWiseGraph() {
    let date = { "date": this.getDate(this.dateModel) };
    this.httpService.post('attendance/district/present-student/per', date).subscribe((data: any) => {
      if (data) {
        this.districtWiseAttendanceCount = data;
      }
    })
  }

  districtWiseTopFive() {
    let date = { "date": this.getDate(this.dateModel) };
    this.httpService.post('attendance/top-performing-districts', date).subscribe((data: any) => {
      if (data) {
        this.setDistrictWiseTopFiveGraph(data);
      }
    })
  }

  setDistrictWiseTopFiveGraph(data: any) {
    this.districtWiseTopFiveGraph = this.graphService.VerticleBarGraph();
    const series: any = [{
      name: "Count",
      data: []
    }];
    this.districtWiseTopFiveGraph.notFound = 0;
    for (let i = 0; i < data.length; i++) {
      series[0].data.push(Number(data[i].totalPresentCount));
      this.districtWiseTopFiveGraph.xaxis.categories.push(data[i].district_name);
      this.districtWiseTopFiveGraph.notFound += data[i].schoolsDataNotFoundCount;
    }
    this.districtWiseTopFiveGraph.series = [...series];
    // this.districtWiseTopFiveGraph.plotOptions.bar.isFunnel = false;
    this.districtWiseTopFiveGraph.legend.show = false;
    this.districtWiseTopFiveGraph.chart.height = 200;
    let colors = ["#36454F"]
    this.districtWiseTopFiveGraph.dataLabels.style.colors = [...colors];
    this.districtWiseTopFiveGraph.dataLabels.dropShadow.enabled = false;
  }

  districtWiseBottomFive() {
    let date = { "date": this.getDate(this.dateModel) };
    this.httpService.post('attendance/bottom-performing-districts', date).subscribe((data: any) => {
      if (data) {
        this.setDistrictWiseBottomFiveGraph(data);
      }
    })
  }

  setDistrictWiseBottomFiveGraph(data: any) {
    this.districtWiseBottomFiveGraph = this.graphService.VerticleBarGraph();
    const series: any = [{
      name: "Count",
      data: []
    }];
    this.districtWiseBottomFiveGraph.notFound = 0;
    for (let i = 0; i < data.length; i++) {
      series[0].data.push(Number(data[i].totalPresentCount));
      this.districtWiseBottomFiveGraph.xaxis.categories.push(data[i].district_name);
      this.districtWiseBottomFiveGraph.notFound += data[i].schoolsDataNotFoundCount;
    }
    this.districtWiseBottomFiveGraph.series = [...series];
    this.districtWiseBottomFiveGraph.chart.height = 200;
    // this.districtWiseBottomFiveGraph.plotOptions.bar.isFunnel = true;
    this.districtWiseBottomFiveGraph.legend.show = false;
    let colors = ["#36454F"]
    this.districtWiseBottomFiveGraph.dataLabels.style.colors = [...colors];
    this.districtWiseBottomFiveGraph.dataLabels.dropShadow.enabled = false;
  }

  zoneWiseTopFive() {
    let data = { "date": this.getDate(this.dateModel), districtName: this.districtModel };
    this.httpService.post('attendance/top-performing-zones/bydistrictname', data).subscribe((data: any) => {
      if (data) {
        this.setZoneWiseTopFiveGraph(data);
      }
    })
  }

  setZoneWiseTopFiveGraph(data: any) {
    this.zoneWiseTopFiveGraph = this.graphService.VerticleBarGraph();
    const series: any = [{
      name: "Count",
      data: []
    }];
    this.zoneWiseTopFiveGraph.notFound = 0;
    for (let i = 0; i < data.length; i++) {
      series[0].data.push(Number(data[i].totalPresentCount));
      this.zoneWiseTopFiveGraph.xaxis.categories.push(data[i].zone_name);
      this.zoneWiseTopFiveGraph.notFound += data[i].schoolsDataNotFoundCount;
    }
    this.zoneWiseTopFiveGraph.series = [...series];
    this.zoneWiseTopFiveGraph.chart.height = 200;
    // this.zoneWiseTopFiveGraph.plotOptions.bar.isFunnel = true;
    this.zoneWiseTopFiveGraph.legend.show = false;
    let colors = ["#36454F"]
    this.zoneWiseTopFiveGraph.dataLabels.style.colors = [...colors];
    this.zoneWiseTopFiveGraph.dataLabels.dropShadow.enabled = false;
  }

  zoneWiseBottomFive() {
    let data = { "date": this.getDate(this.dateModel), districtName: this.districtModel };
    this.httpService.post('attendance/bottom-performing-zones/bydistrictname', data).subscribe((data: any) => {
      if (data) {
        this.setZoneWiseBottomFiveGraph(data);
      }
    })
  }

  setZoneWiseBottomFiveGraph(data: any) {
    this.zoneWiseBottomFiveGraph = this.graphService.VerticleBarGraph();
    const series: any = [{
      name: "Count",
      data: []
    }];
    this.zoneWiseBottomFiveGraph.notFound = 0;
    for (let i = 0; i < data.length; i++) {
      series[0].data.push(Number(data[i].totalPresentCount));
      this.zoneWiseBottomFiveGraph.xaxis.categories.push(data[i].zone_name);
      this.zoneWiseBottomFiveGraph.notFound += data[i].schoolsDataNotFoundCount;
    }
    this.zoneWiseBottomFiveGraph.series = [...series];
    this.zoneWiseBottomFiveGraph.chart.height = 200;
    // this.zoneWiseBottomFiveGraph.plotOptions.bar.isFunnel = true;
    this.zoneWiseBottomFiveGraph.legend.show = false;
    let colors = ["#36454F"]
    this.zoneWiseBottomFiveGraph.dataLabels.style.colors = [...colors];
    this.zoneWiseBottomFiveGraph.dataLabels.dropShadow.enabled = false;
  }

  schoolWiseTopFive() {
    let data = { "date": this.getDate(this.dateModel), zoneName: this.zoneModel };
    this.httpService.post('attendance/top-performing-schools/byzonename', data).subscribe((data: any) => {
      if (data) {
        this.setSchoolWiseTopFive(data);
      }
    })
  }

  setSchoolWiseTopFive(data: any) {
    this.schoolWiseTopFiveGraph = this.graphService.VerticleBarGraph();
    const series: any = [{
      name: "Count",
      data: []
    }];
    this.schoolWiseTopFiveGraph.notFound = 0;
    for (let i = 0; i < data.length; i++) {
      series[0].data.push(Number(data[i].totalPresentCount));
      this.schoolWiseTopFiveGraph.xaxis.categories.push(data[i].schoolName);
      this.schoolWiseTopFiveGraph.notFound += data[i].schoolsDataNotFoundCount;
    }
    this.schoolWiseTopFiveGraph.series = [...series];
    this.schoolWiseTopFiveGraph.chart.height = 200;
    // this.schoolWiseTopFiveGraph.plotOptions.bar.isFunnel = true;
    this.schoolWiseTopFiveGraph.legend.show = false;
    let colors = ["#36454F"]
    this.schoolWiseTopFiveGraph.dataLabels.style.colors = [...colors];
    this.schoolWiseTopFiveGraph.dataLabels.dropShadow.enabled = false;

  }

  schoolWiseBottomFive() {
    let data = { "date": this.getDate(this.dateModel), zoneName: this.zoneModel };
    this.httpService.post('attendance/bottom-performing-schools/byzonename', data).subscribe((data: any) => {
      if (data) {
        this.setSchoolWiseBottomFive(data);
      }
    })
  }

  setSchoolWiseBottomFive(data: any) {
    this.schoolWiseBottomFiveGraph = this.graphService.VerticleBarGraph();
    const series: any = [{
      name: "Count",
      data: []
    }];
    this.schoolWiseBottomFiveGraph.notFound = 0;
    for (let i = 0; i < data.length; i++) {
      series[0].data.push(Number(data[i].totalPresentCount));
      this.schoolWiseBottomFiveGraph.xaxis.categories.push(data[i].schoolName);
      this.schoolWiseBottomFiveGraph.notFound += data[i].schoolsDataNotFoundCount;
    }
    this.schoolWiseBottomFiveGraph.chart.height = 200;
    // this.schoolWiseBottomFiveGraph.plotOptions.bar.isFunnel = true;
    this.schoolWiseBottomFiveGraph.legend.show = false;
    let colors = ["#36454F"]
    this.schoolWiseBottomFiveGraph.dataLabels.style.colors = [...colors];
    this.schoolWiseBottomFiveGraph.dataLabels.dropShadow.enabled = false;
  }

}
