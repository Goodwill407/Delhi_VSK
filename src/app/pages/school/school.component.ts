import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { GraphService } from 'src/app/services/graph-service.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription, forkJoin } from 'rxjs';
import { CommunicationService } from 'src/app/services/communication.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent {
  // Graphs
  teacherGenderRatio: any;
  studentsGenderRatio: any;
  genderWiseClass: any;
  typesOfSchools: any;
  shiftWiseSchools: any;
  schoolsByManagement: any;
  lowClassHighClass: any;
  allZones: any;
  streamCount: any;
  minorityCount: any;
  affiliationCount: any;

  // Single data
  teachersRatio: any;
  totalSchools: any;
  averageTeacherOfSchool: any;
  averageStudentOfSchool: any;
  allDistricts: any;
  districtModel: any = "";
  zoneModel: any = "";
  schoolModel: any = "";
  districtName: any;
  allSchools: any;
  teacherGender: any;
  studGender: any;
  allTeacher: any;
  allTeacherData: any;
  allStudentData: any;
  @ViewChild('openModal') openModal: any;
  itemCount: number | undefined;
  subscription: Subscription | undefined;
  searchBox: any;
  communicationServiceMobile: any;
  ratioDataObj: any;

  constructor(private httpService: HttpServiceService, private spinner: NgxSpinnerService, private route: ActivatedRoute, private graphService: GraphService, private toastr: ToastrService, private communicationService: CommunicationService) {
    this.communicationServiceMobile = this.communicationService.isMobile;
  }

  ngOnInit() {
    this.getAllDistricts();
    this.getAllSchoolGraph();
    this.getDistrictName();
    this.getAllZones();
    this.getAllSchoolName();
    this.getSchoolByDistrict();

    this.subscription = this.graphService
      .getItemCountObservable()
      .subscribe((count) => {
        this.itemCount = count;
        if (this.itemCount && this.schoolModel && this.teacherGender) {
          this.getTeachersByGender(false);
        } else if (this.itemCount && this.schoolModel && this.studGender) {
          this.getStudentByGender(false);
        }
      });

  }

  getAllDistricts() {
    // this.spinner.show();
    this.httpService.get('school/districtNames').subscribe((data: any) => {
      if (data && data.length > 0) {
        this.allDistricts = data;
        // this.spinner.hide();
        this.allDistricts = this.allDistricts.sort((a: any, b: any) => a.D_ID - b.D_ID);
      }
    }, (error) => {
      // this.spinner.hide();
      this.toastr.error('', 'Something went wrong !');
    })
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

  getSchoolDataByDistrict() {
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

  getSchoolDataByZone() {
    const zone = {
      Zone_Name: this.zoneModel
    }
    this.spinner.show();
    this.httpService.post('school/getZoneSchool', zone).subscribe((data: any) => {
      if (data && data.ZoneSchool) {
        this.allSchools = data.ZoneSchool;
        this.allSchools = this.allSchools.sort((a: any, b: any) => a.Schoolid - b.Schoolid);
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

  setAllGraphs(data: any, zone: any) {
    let objData = this.transformStudentStatusCounts(data.studentStatusCounts);
    this.ratioDataObj = objData.studentStatusCounts;
    this.teachersRatio = data.teacherStudentRatio?.toFixed(2);
    this.totalSchools = data.totalSchools;
    this.averageStudentOfSchool = data.averageStudentOfSchool?.toFixed(2);
    this.averageTeacherOfSchool = data.averageTeacherOfSchool?.toFixed(2);

    const studentsGender = {
      totalBoys: data.totalBoys ? data.totalBoys : 0,
      totalGirls: data.totalGirls ? data.totalGirls : 0,
      Other: data.Other ? data.Other : 0,
    }
    this.getStudentsGenderRatio(studentsGender);

    const teachersGender = {
      totalMaleTeachers: data.totalMaleTeachers ? data.totalMaleTeachers : 0,
      totalFemaleTeachers: data.totalFemaleTeachers ? data.totalFemaleTeachers : 0
    }
    this.getTeachersGenderRatio(teachersGender);
    this.getShiftWiseSchools(data.shiftWiseCount);
    this.getSchoolsByManagement(data.schoolManagementWise);
    const lowClassHighClass = {
      lowClassCount: data.lowClassCount,
      highClassCount: data.highClassCount
    }
    const teacherType = {guestTeachers:data.guestTeachers,regularTeachers:data.regularTeachers};
    this.getallTeachers(teacherType);
    this.getTypesOfSchools(data.typeOfSchoolCounts);
    // this.getStreamCount(data.streamCounts);
    // this.getMinorityCount(data.minorityCounts);
    // this.getAffiliationCount(data.afiliationCounts);
    if (zone) {
      this.getAllZones();
    }
  }

  setClassGraph(data: any) {
    this.getGenderWiseClass(data)
  }

  getGenderWiseClass(data: any) {
    let stringArr: any[] = [];
    let numArr: any[] = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].class === "Nursery") {
        stringArr.push(data[i]);
        console.log(data[i])
      }
      else if (data[i].class === "KG") {
        stringArr.push(data[i])
      }
      else {
        numArr.push(data[i]);
      }
    }
    numArr = numArr.sort((a: any, b: any) => a.class - b.class);
    stringArr = stringArr.sort((a: any, b: any) => a.class - b.class);
    data = [...stringArr, ...numArr];
    this.genderWiseClass = this.graphService.districtWiseGraph();
    this.genderWiseClass.chart.stacked = false;
    this.genderWiseClass.chart.height = 300;
    this.genderWiseClass.series[0].name = "Male";
    this.genderWiseClass.series[1].name = "Female";
    this.genderWiseClass.series[2].name = "Transgender";
    this.genderWiseClass.series.pop();
    for (let i = 0; i < data.length; i++) {
      this.genderWiseClass.series[0].data.push(data[i].M ? data[i].M : 0);
      this.genderWiseClass.series[1].data.push(data[i].F ? data[i].F : 0);
      this.genderWiseClass.series[2].data.push(data[i].T ? data[i].T : 0);
      this.genderWiseClass.xaxis.categories.push(data[i].class ? (data[i].class == "KG" || data[i].class == "Nursery" ? data[i].class : 'Class' + ' ' + data[i].class) : 'Class NA');
      this.genderWiseClass.dataLabels = { enabled: false }
    }
  }

  getAllSchoolGraph() {
    this.spinner.show();
    const api1 = this.httpService.get('graphs/school-teacher-student-graph');
    const api2 = this.httpService.get('class-student');

    forkJoin([api1, api2]).subscribe(([res1, res2]) => {
      this.setAllGraphs(res1, true);
      this.setClassGraph(res2);
      this.spinner.hide();
    }, ([err1, err2]) => {
      if (err1 || err2) {
        this.toastr.error('', 'Something went wrong !');
        this.spinner.hide();
      }
    });
  }

  getSchoolByDistrict() {
    this.spinner.show();
    this.httpService.get('graphs/school-student-count-by-district').subscribe((data: any) => {
      if (data) {
        this.spinner.hide();
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error('', 'Something went wrong !');
    })
  }

  getGraphsByZone() {
    if (this.zoneModel) {
      const zone = { zoneName: this.zoneModel };
      this.spinner.show();
      const api1 = this.httpService.post('zonegraph/school-student-teacher-graph-zonename', zone);
      const api2 = this.httpService.post('class-student/zone', { "zone": this.zoneModel });

      forkJoin([api1, api2]).subscribe(([res1, res2]) => {
        this.setClassGraph(res2);
        this.setAllGraphs(res1, true);
        this.schoolModel = '';
        this.getSchoolDataByZone();
        this.spinner.hide();
      }, ([err1, err2]) => {
        if (err1 || err2) {
          this.toastr.error('', 'Something went wrong !');
          this.spinner.hide();
        }
      });
    } else {
      this.allSchools = [];
      this.getGraphsByDistrictName();
    }
  }

  getGraphsByDistrictName() {
    this.spinner.show();
    if (this.districtModel) {
      const district = {
        districtName: this.districtModel
      }
      this.spinner.show();
      const api1 = this.httpService.post('zonegraph/school-student-teacher-graph-district', district);
      const api2 = this.httpService.post('class-student/district', { district: this.districtModel });

      forkJoin([api1, api2]).subscribe(([res1, res2]) => {
        this.setAllGraphs(res1, true);
        this.setClassGraph(res2);
        this.spinner.hide();
      }, ([err1, err2]) => {
        if (err1 || err2) {
          this.toastr.error('', 'Something went wrong !');
          this.spinner.hide();
        }
      });
    } else {
      this.allSchools = [];
      this.getAllSchoolGraph();
    }
    this.zoneModel = "";
    this.schoolModel = "";
  }

  getGraphsBySchoolName() {
    this.spinner.show();
    if (this.schoolModel) {
      const school = {
        "schoolId": this.schoolModel.Schoolid
      }
      this.spinner.show();
      const api1 = this.httpService.post('zonegraph/school-student-teacher-graph-schoolid', school);
      const api2 = this.httpService.post('class-student/school', { "Schoolid": Number(this.schoolModel.Schoolid) });

      forkJoin([api1, api2]).subscribe(([res1, res2]) => {
        this.setAllGraphs(res1, true);
        this.setClassGraph(res2);
        this.spinner.hide();
      }, ([err1, err2]) => {
        if (err1 || err2) {
          this.toastr.error('', 'Something went wrong !');
          this.spinner.hide();
        }
      });
    }
  }

  getStudentsGenderRatio(studentsGender: any) {
    this.studentsGenderRatio = this.graphService.PieGraph('donut', 'Students');
    this.studentsGenderRatio.series = [studentsGender.totalBoys, studentsGender.totalGirls, studentsGender.Other];
    this.studentsGenderRatio.labels = ["Boys", "Girls", "Other"];
    this.studentsGenderRatio.chart.events = {
      dataPointSelection: (event: any, chartContext: any, config: any) => {
        this.clearData();
        this.studGender = config;
        this.graphService.addToCart();
      }
    }
  }

  getStudentByGender(flash: any) {
    if (!flash) {
      this.spinner.show();
      const parameter = {
        "Gender": this.studGender.dataPointIndex == 0 ? 'M' : (this.studGender?.dataPointIndex == 1 ? 'F' : 'T'),
        "Schoolid": this.schoolModel.Schoolid,
      }
      this.httpService.post('student/studentcount/schoolname/gender', parameter).subscribe((res: any) => {
        this.allStudentData = res;
        if (!flash) {
          this.openModal.nativeElement.click();
        }
        this.spinner.hide();
      }, (error) => {
        this.spinner.hide();
        this.toastr.error('', 'Something went wrong !');
      })
    }
  }

  getTeachersGenderRatio(teachersGender: any) {
    this.teacherGenderRatio = this.graphService.PieGraph('donut', ' Teachers');
    this.teacherGenderRatio.series = [teachersGender.totalMaleTeachers, teachersGender.totalFemaleTeachers];
    this.teacherGenderRatio.labels = ["Male", "Female"];
    this.teacherGenderRatio.chart.events = {
      dataPointSelection: (event: any, chartContext: any, config: any) => {
        this.clearData();
        this.teacherGender = config;
        this.graphService.addToCart();
      }
    }
  }

  getallTeachers(teacherType: any) {
    this.allTeacher = this.graphService.PieGraph('donut', ' Teachers');
    this.allTeacher.series = [teacherType.regularTeachers, teacherType.guestTeachers];
    this.allTeacher.labels = ["Regular", "Guest"];
  }

  getTeachersByGender(flash: any) {
    if (!flash) {
      const parameter = {
        "gender": this.teacherGender.dataPointIndex == 0 ? 'Male' : 'Female',
        "schname": this.schoolModel.Schoolid
      }
      this.httpService.post('teacher/get-teachers-by-gender', parameter).subscribe((res: any) => {
        this.allTeacherData = res;
        if (!flash) {
          this.openModal.nativeElement.click();
        }
      })
    }
  }

  clearData() {
    this.allStudentData = [];
    this.studGender = '';
    this.teacherGender = '';
    this.allTeacherData = [];
  }

  getSchoolsByManagement(schoolManagementWise: any) {
    this.schoolsByManagement = this.graphService.PieGraph('donut', ' Schools');
    const entries = Object.entries(schoolManagementWise);
    entries.forEach(([key, value]) => {
      this.schoolsByManagement.series.push(value);
      this.schoolsByManagement.labels.push(key);
    });
  }

  getShiftWiseSchools(shiftWiseCount: any) {
    this.shiftWiseSchools = this.graphService.PolarGraph('Shift');
    const entries = Object.entries(shiftWiseCount);
    entries.forEach(([key, value]) => {
      if (Number(value) > 0) {
        this.shiftWiseSchools.series.push(value);
        this.shiftWiseSchools.labels.push(key);
      }
    });
    for (let i = 0; i < this.shiftWiseSchools.series.length; i++) {
      if (this.shiftWiseSchools.series[i] > 0 && this.shiftWiseSchools.series[i] < 2) {
        this.shiftWiseSchools.yaxis.show = false;
      }
    }
    shiftWiseCount.tooltip= {
      y: {
          title: {
              formatter: (val: any) => {
                  return 'Shit ' + val + ':'
              }
          }
      }
  }
    
  }

  getLowClassHighClass(lowClassHighClass: any) {
    // this.lowClassHighClass = this.graphService.PieGraph('donut', ' Schools');
    // this.lowClassHighClass.series = [lowClassHighClass.lowClassCount, lowClassHighClass.highClassCount];
    // this.lowClassHighClass.labels = ['Low class', 'High class']
  }

  getTypesOfSchools(typesOfSchools: any) {
    this.typesOfSchools = this.graphService.PolarGraph('Schools');
    if (typesOfSchools.length > 0) {
      typesOfSchools.forEach((key: any, value: any) => {
        if (Number(key.count) > 0) {
          this.typesOfSchools.series.push(key.count);
          this.typesOfSchools.labels.push(key.typeOfSchool);
        }
      })
    }
    for (let i = 0; i < typesOfSchools.length; i++) {
      if (this.typesOfSchools.series[i] > 0 && this.typesOfSchools.series[i] < 2) {
        this.typesOfSchools.yaxis.show = false;
      }
    }
  }

  getStreamCount(streamCount: any) {
    this.streamCount = this.graphService.VerticleBarGraph();
    const series: any = [{
      name: "Count",
      data: []
    }];
    for (let i = 0; i < streamCount.length; i++) {
      series[0].data.push(streamCount[i].count);
      this.streamCount.xaxis.categories.push(streamCount[i].stream);
    }
    this.streamCount.series = [...series];
    this.streamCount.xaxis.title.text = "Total Count";
    this.streamCount.yaxis.title.text = "Streams";
  }

  getMinorityCount(minorityCount: any) {
    this.minorityCount = this.graphService.PieGraph('donut', ' Schools');
    let colors = [];
    for (let i = 0; i < 8; i++) {
      colors.push(this.getRandomColor())
    }
    this.minorityCount.fill.colors = colors;
    for (let i = 0; i < minorityCount.length; i++) {
      this.minorityCount.series.push(minorityCount[i].count);
      this.minorityCount.labels.push(minorityCount[i].minority);
    }
  }

  getAffiliationCount(afiliationCounts: any) {
    this.affiliationCount = this.graphService.PieGraph('pie', ' Affiliation');
    for (let i = 0; i < afiliationCounts.length; i++) {
      this.affiliationCount.series.push(afiliationCounts[i].count);
      this.affiliationCount.labels.push(afiliationCounts[i].afiliation);
    }
  }

  getAllZones() {
    // this.allZones = this.graphService.TreeGraph();
    // for (let i = 0; i < allZones.length; i++) {
    //   this.allZones.series[0].data.push({ x: allZones[i].zone, y: allZones[i].count });
    // }
    if (this.districtModel) {
      const district = { "District_name": this.districtModel };
      this.httpService.post('school/getDistrictZone', district).subscribe((res: any) => {
        this.allZones = res.ZoneSchool;
      })
    } else {
      this.httpService.get('school/zonename').subscribe((res: any) => {
        this.allZones = res.ZoneInfo;
        this.allZones = this.allZones.sort((a: any, b: any) => a.Z_ID - b.Z_ID);
      })
    }
  }

  getDistrictName() {
    this.route.queryParams.subscribe((param: any) => {
      this.districtName = param['districtName'];
      if (this.districtName) {
        this.districtModel = this.districtName;
        this.getGraphsByDistrictName();
      }
    })
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  exportToCSV(): void {
    this.communicationService.exportToCSV(this.allTeacherData?.length > 0 ? this.allTeacherData : this.allStudentData, 'table_data');
  }

  exportToExcel(): void {
    this.communicationService.exportToExcel(this.allTeacherData?.length > 0 ? this.allTeacherData : this.allStudentData, 'table_data', 'Sheet1');
  }

  transformStudentStatusCounts(response: any[]): any {
    const result: any = {};
    for (const statusCount of response) {
      let status = statusCount._id || "other";
      // Replace spaces with underscores (you can choose a different approach if needed)
      status = status.replace(/\s+/g, '_');
      result[status] = statusCount.count;
    }
    return { studentStatusCounts: result };
  }
}
