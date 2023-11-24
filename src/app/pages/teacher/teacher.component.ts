import { Component, ViewChild } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GraphService } from 'src/app/services/graph-service.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent {
  commonBarGraph: any;
  commonPieGraph: any;
  commonPollarChart: any;
  chartOptions1: any;
  commonTreeMap: any;

  teacherGenderRatio: any;
  studentsGenderRatio: any;
  schoolsManagementWiseTeacher: any;
  schoolTypeWiseCount: any;
  experienceWiseTeacher: any;
  shiftWiseSchools: any;
  averageTeacherOfSchool: any;
  allDistricts: any;
  allSchools: any;
  districtModel: any = "";
  schoolModel: any = "";
  zoneModel: any = "";
  allZones: any;
  districtName: any;
  schoolName: any;
  allTeacherData: any;
  designation: any;
  teacherCategory: any;
  streamWiseTeacher: any;
  minorityWiseTeacher: any;
  allData: any;
  @ViewChild('openModal') openModal: any;

  config: any;
  constructor(private httpService: HttpServiceService, private spinner: NgxSpinnerService, private graphService: GraphService) { }

  ngOnInit() {
    this.getAllTeacherData();
    this.getAllDistricts();
    this.getAllZones();
  }

  getAllDistricts() {
    this.httpService.get('school/districtNames').subscribe((data: any) => {
      if (data && data.districtNames.length > 0) {
        this.allDistricts = data.districtNames;
      }
    })
  }


  getAllTeacherData() {
    this.spinner.show();
    this.httpService.get('teacher-graph/school-category-wise').subscribe((data: any) => {
      if (data) {
        this.setAllGraphs(data);
        this.spinner.hide();
      }
    })
  }

  setAllGraphs(data: any) {
    this.allData = data;
    const teachersGender = {
      totalMaleTeachers: data.totalMaleTeachers,
      totalFemaleTeachers: data.totalFemaleTeachers
    }
    this.getTeachersGenderRatio(teachersGender);
    this.getschoolsManagementWiseTeacher(data.teacherManagmentWiseCounts);
    this.getShiftWiseSchools(data.teacherShiftWiseCounts);
    let newData = data.teacherCounts.sort((a: any, b: any) => a.teacherCount - b.teacherCount);
    this.getCategoryWiseTeacher(newData);
    this.getDesignation(data.postdescWiseTeacherCounts);
    this.getExperianceOfTeachers(data.experianceOfTeachers);
    this.getSchoolTypeWiseCount(data.teacherTypeOfSchoolWiseCounts);
    this.getStreamWiseCount(data.teacherStreamWiseCounts);
    this.getMinorityWiseCount(data.teacherMinorityWiseCounts);
    this.spinner.hide();
  }

  getGraphsByDistrictName() {
    if (this.districtModel) {
      const district = {
        DistrictName: this.districtModel
      }
      this.spinner.show();
      this.httpService.post('teacher-graph/school-category-wise/district', district).subscribe((data: any) => {
        if (data) {
          this.setAllGraphs(data);
          this.getAllZones();
          this.getAllSchools();
          this.zoneModel = '';
          this.schoolModel = '';
        }
      })
    } else {
      this.getAllTeacherData();
      this.getAllZones();
      this.allSchools = [];
      this.zoneModel = '';
      this.schoolModel = '';
    }

  }

  getAllZones() {
    if (this.districtModel) {
      const district = { "District_name": this.districtModel };
      this.httpService.post('school/getDistrictZone', district).subscribe((res: any) => {
        this.allZones = res.ZoneSchool;
      })
    } else {
      this.httpService.get('school/zonename').subscribe((res: any) => {
        this.allZones = res.ZoneNames;
      })
    }
  }

  getGraphsByZone() {
    this.spinner.show();
    const zone = {
      zoneName: this.zoneModel
    }
    this.httpService.post('teacher-graph/school-category-wise/zone', zone).subscribe((data: any) => {
      if (data) {
        this.setAllGraphs(data);
        this.spinner.hide();
      }
    }, (error) => {
      this.spinner.hide();
    });
    this.getSchoolDataByZone();
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

  getAllSchools() {
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

  getGraphsBySchoolName() {
    const school = {
      schname: this.schoolModel
    }
    this.spinner.show();
    this.httpService.post('teacher-graph/school-category-wise/school', school).subscribe((data: any) => {
      if (data) {
        this.setAllGraphs(data);
        this.spinner.hide();
      }
      this.spinner.hide();
      // this.getTeachersByGender();
    })
  }


  getTeachersGenderRatio(teachersGender: any) {
    const series = [teachersGender.totalMaleTeachers, teachersGender.totalFemaleTeachers];
    const categories = ["Male", "Female"];
    this.teacherGenderRatio = this.graphService.PieGraph('donut', '');
    this.teacherGenderRatio.series = [...series];
    this.teacherGenderRatio.chart.type = "pie";
    this.teacherGenderRatio.labels = [...categories];
    this.teacherGenderRatio.chart.events = {
      dataPointSelection: (event: any, chartContext: any, config: any) => {
        console.log(config);
        this.config = config;
        const parameter = {
          "gender": config.dataPointIndex == 0 ? 'Male' : 'Female',
          "schname": this.schoolModel
        }
        this.getTeachersByGender();
      }
    }
  }

  getTeachersByGender() {
    const parameter = {
      "gender": this.config.dataPointIndex == 0 ? 'Male' : 'Female',
      "schname": this.schoolModel
    }
    this.httpService.post('teacher/get-teachers-by-gender', parameter).subscribe((res: any) => {
      this.allTeacherData = res;
      this.openModal.nativeElement.click();
      // return;
      // alert(JSON.stringify(this.allTeacherData))
    })
  }

  getShiftWiseSchools(shiftWiseCount: any) {
    let Morning = 0; let Afternoon = 0; let Evening = 0; let General = 0;
    for (let i = 0; i < shiftWiseCount.length; i++) {
      if (shiftWiseCount[i].shift == "General") {
        General = shiftWiseCount[i].teacherShiftWiseCount;
      }
      if (shiftWiseCount[i].shift == "Morning") {
        Morning = shiftWiseCount[i].teacherShiftWiseCount;
      }
      if (shiftWiseCount[i].shift == "Afternoon") {
        Afternoon = shiftWiseCount[i].teacherShiftWiseCount;
      }
      if (shiftWiseCount[i].shift == "Evening") {
        Evening = shiftWiseCount[i].teacherShiftWiseCount;
      }
    }
    const series = [Morning, Afternoon, Evening, General]
    this.shiftWiseSchools = this.graphService.PolarGraph();
    this.shiftWiseSchools.series = [...series];
    this.shiftWiseSchools.labels = ['Morning', 'Afternoon', 'Evening', 'General']
  }


  getschoolsManagementWiseTeacher(schoolManagementWise: any) {
    this.schoolsManagementWiseTeacher = this.graphService.PieGraph('donut', '')
    for (let i = 0; i < schoolManagementWise.length; i++) {
      if (schoolManagementWise[i].shift == "Government") { var govCount = schoolManagementWise[i].teacherManagmentWiseCount }
      if (schoolManagementWise[i].shift == "Aided") { var aidedCount = schoolManagementWise[i].teacherManagmentWiseCount }
    }
    this.schoolsManagementWiseTeacher.series = [govCount ? govCount : 0, aidedCount ? aidedCount : 0];
    this.schoolsManagementWiseTeacher.labels = ['Government', 'Aided']
  }

  getCategoryWiseTeacher(data: any) {
    this.teacherCategory = this.graphService.VerticleBarGraph();;
    const series: any = [{
      name: "Count",
      data: []
    }];
    for (let i = 0; i < data.length; i++) {
      series[0].data.push(data[i].teacherCount);
      this.teacherCategory.xaxis.categories.push(data[i].SchCategory);
    }
    this.teacherCategory.series = [...series];

  }

  getExperianceOfTeachers(data: any) {
    this.experienceWiseTeacher = this.graphService.VerticleBarGraph();
    const series: any = [{
      name: "Count",
      data: []
    }];
    series[0].data = [data.under5Years, data.fiveTo10Years, data.tenTo15Years, data.fifteenTo20Years, data.twentyTo25Years, data.over25Years];
    this.experienceWiseTeacher.series = [...series]
    this.experienceWiseTeacher.colors = ["#F44F5E"];
    this.experienceWiseTeacher.xaxis.categories = ['0-5 Years', '5-10 Years', '10-15 Years', '15-20 Years', '20-25 Years', '25 + Years'];

  }

  getDesignation(post: any) {
    this.designation = this.graphService.VerticleBarGraph();
    const series: any = [{
      name: ["Teacher Count"],
      data: []
    }];
    for (let i = 0; i < post.length; i++) {
      series[0].data.push(post[i].teacherCount);
      this.designation.xaxis.categories.push(post[i]._id);
    }
    this.designation.series = [...series];
    this.designation.plotOptions.bar.horizontal = false;
    this.designation.xaxis.title.text = "Designation";
    this.designation.yaxis.title.text = "Teacher Count";
    this.designation.dataLabels.enabled = false;
  }

  getSchoolTypeWiseCount(data: any) {
    this.schoolTypeWiseCount = this.graphService.PolarGraph();
    for (let i = 0; i < data.length; i++) {
      this.schoolTypeWiseCount.series.push(data[i].teacherTypeOfSchoolWiseCount);
      this.schoolTypeWiseCount.labels.push(data[i].typeOfSchool);
    }
  }

  getStreamWiseCount(data: any) {
    let series: any = [{
      name: ["Teacher"],
      data: []
    }];
    this.streamWiseTeacher = this.graphService.VerticleBarGraph();
    for (let i = 0; i < data.length; i++) {
      series[0].data.push(data[i].teacherStreamWiseCount);
      this.streamWiseTeacher.xaxis.categories.push(data[i].stream);
    }
    this.streamWiseTeacher.series = [...series];
    this.streamWiseTeacher.plotOptions.bar.horizontal = false;
    this.streamWiseTeacher.xaxis.title.text = "Stream"
    this.streamWiseTeacher.yaxis.title.text = "Teacher Count"
  }

  getMinorityWiseCount(data: any) {
    this.minorityWiseTeacher = this.graphService.PieGraph('donut', '');
    for (let i = 0; i < data.length; i++) {
      this.minorityWiseTeacher.series.push(data[i].teacherMinorityWiseCount);
      this.minorityWiseTeacher.labels.push(data[i].minority);
    }
  }

  openModal1() {
  }
}
