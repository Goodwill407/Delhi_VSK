import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { GraphService } from 'src/app/services/graph-service.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent {

  // Graphs
  teacherGenderRatio: any;
  studentsGenderRatio: any;
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
  allTeacherData: any;
  allStudentData: any;
  @ViewChild('openModal') openModal: any;
  itemCount: number | undefined;
  subscription: Subscription | undefined;

  constructor(private httpService: HttpServiceService, private spinner: NgxSpinnerService, private route: ActivatedRoute, private graphService: GraphService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.getAllDistricts();
    this.getAllSchoolGraph();
    this.getDistrictName();
    this.getAllZones();

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
    this.httpService.get('graphs/school-student-count-by-district').subscribe((data: any) => {
      if (data && data.length > 0) {
        this.allDistricts = data;
      }
    })
  }

  getSchoolDataByDistrict() {
    const district = {
      District_name: this.districtModel
    }
    this.httpService.post('school/getDistrictSchool', district).subscribe((data: any) => {
      if (data && data.districtSchools) {
        this.allSchools = data.districtSchools;
      } else {
        this.allSchools = [];
      }
    });
  }

  getSchoolDataByZone() {
    const zone = {
      Zone_Name: this.zoneModel
    }
    this.httpService.post('school/getZoneSchool', zone).subscribe((data: any) => {
      if (data && data.ZoneSchool) {
        this.allSchools = data.ZoneSchool;
      } else {
        this.allSchools = [];
      }
    });
  }

  setAllGraphs(data: any, zone: any) {
    this.teachersRatio = data.teacherStudentRatio?.toFixed(2);
    this.totalSchools = data.totalSchools;
    this.averageStudentOfSchool = data.averageStudentOfSchool?.toFixed(2);
    this.averageTeacherOfSchool = data.averageTeacherOfSchool?.toFixed(2);

    const studentsGender = {
      totalBoys: data.totalBoys ? data.totalBoys : 0,
      totalGirls: data.totalGirls ? data.totalGirls : 0
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
    this.getLowClassHighClass(lowClassHighClass);
    this.getTypesOfSchools(data.typeOfSchoolCounts);
    // this.getStreamCount(data.streamCounts);
    // this.getMinorityCount(data.minorityCounts);
    // this.getAffiliationCount(data.afiliationCounts);
    if (zone) {
      this.getAllZones();
    }
  }

  getAllSchoolGraph() {
    this.spinner.show();
    this.httpService.get('graphs/school-teacher-student-graph').subscribe((data: any) => {
      if (data) {
        this.setAllGraphs(data, true);
        this.spinner.hide();
      }
    }, (error) => {
      this.toastr.error('', 'Something went wrong !');
    })
  }

  getGraphsByZone() {
    this.spinner.show();
    const zone = {
      zoneName: this.zoneModel
    }
    this.getSchoolDataByZone();
    this.httpService.post('zonegraph/school-student-teacher-graph-zonename', zone).subscribe((data: any) => {
      if (data) {
        this.setAllGraphs(data, false);
        this.spinner.hide();
      }
    }, (error) => {
      this.toastr.error('', 'Something went wrong !');
    })
  }

  getGraphsByDistrictName() {
    this.spinner.show();
    if (this.districtModel) {
      const district = {
        districtName: this.districtModel
      }
      this.httpService.post('zonegraph/school-student-teacher-graph-district', district).subscribe((data: any) => {
        if (data) {
          this.setAllGraphs(data, true);
          this.getSchoolDataByDistrict();
          this.spinner.hide();
        }
      }, (error) => {
        this.toastr.error('', 'Something went wrong !');
      })
    } else {
      this.getAllSchoolGraph();
    }
    this.zoneModel = "";
    this.schoolModel = "";
  }

  getGraphsBySchoolName() {
    this.spinner.show();
    const school = {
      "schoolId": this.schoolModel.Schoolid
    }
    this.httpService.post('zonegraph/school-student-teacher-graph-schoolid', school).subscribe((data: any) => {
      if (data) {
        this.setAllGraphs(data, false);
        this.spinner.hide();
      }
    }, (error) => {
      this.toastr.error('', 'Something went wrong !');
    })
  }

  getStudentsGenderRatio(studentsGender: any) {
    this.studentsGenderRatio = this.graphService.PieGraph('donut', ' Students');
    this.studentsGenderRatio.series = [studentsGender.totalBoys, studentsGender.totalGirls];
    this.studentsGenderRatio.labels = ["Boys", "Girls"];
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
        "Gender": this.studGender.dataPointIndex == 0 ? 'M' : 'F',
        "Schoolid": this.schoolModel.Schoolid,
      }
      this.httpService.post('student/studentcount/schoolname/gender', parameter).subscribe((res: any) => {
        this.allStudentData = res;
        if (!flash) {
          this.openModal.nativeElement.click();
        }
        this.spinner.hide();
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
    this.shiftWiseSchools = this.graphService.PolarGraph();
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
  }

  getLowClassHighClass(lowClassHighClass: any) {
    // this.lowClassHighClass = this.graphService.PieGraph('donut', ' Schools');
    // this.lowClassHighClass.series = [lowClassHighClass.lowClassCount, lowClassHighClass.highClassCount];
    // this.lowClassHighClass.labels = ['Low class', 'High class']
  }

  getTypesOfSchools(typesOfSchools: any) {
    this.typesOfSchools = this.graphService.PolarGraph();
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

}
