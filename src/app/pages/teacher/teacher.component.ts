import { Component } from '@angular/core';
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
  districtName: any;
  schoolName: any;
  designation: any;
  teacherCategory: any;
  streamWiseTeacher: any;
  minorityWiseTeacher: any;
  allData: any;

  constructor(private httpService: HttpServiceService, private spinner: NgxSpinnerService, private graphService: GraphService) {
    this.commonBarGraph = {
      series: [
        {
          name: "basic",
          data: []
        }
      ],
      chart: {
        type: "bar",
        height: '600px'
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: true
      },
      xaxis: {
        categories: [
        ]
      }
    };
  }

  ngOnInit() {
    this.getAllData();
    this.getAllDistricts();
    this.getAllSchools();
  }

  getAllDistricts() {
    this.httpService.get('graphs/school-student-count-by-district').subscribe((data: any) => {
      if (data && data.length > 0) {
        this.allDistricts = data;
      }
    })
  }

  getAllData() {
    this.httpService.get('graphs').subscribe((data: any) => {
      if (data) {
        this.allData = data;
        this.averageTeacherOfSchool = data.averageTeacherOfSchool;

        const teachersGender = {
          totalMaleTeachers: data.totalMaleTeachers,
          totalFemaleTeachers: data.totalFemaleTeachers
        }
        this.getTeachersGenderRatio(teachersGender);
        this.getAllTeacherData();
      }
    })
  }

  getAllTeacherData() {
    this.spinner.show();
    this.httpService.get('teacher-graph/school-category-wise').subscribe((data: any) => {
      if (data) {
        this.getschoolsManagementWiseTeacher(data.teacherManagmentWiseCounts);
        this.getShiftWiseSchools(data.teacherShiftWiseCounts);
        let newData = data.teacherCounts.sort((a: any, b: any) => a.teacherCount - b.teacherCount);
        this.getCategoryWiseTeacher(newData);
        this.getDesignation(data.postdescWiseTeacherCounts);
        this.getExperianceOfTeachers(data.experianceOfTeachers);
        this.getSchoolTypeWiseCount(data.teacherTypeOfSchoolWiseCounts);
        this.getStreamWiseCount(data);
        this.getMinorityWiseCount(data.teacherMinorityWiseCounts);

        this.spinner.hide();
      }
    })
  }

  getGraphsByDistrictName() {
    const district = {
      DistrictName: this.districtModel
    }
    this.spinner.show();
    this.httpService.post('teacher-graph/school-category-wise/district', district).subscribe((data: any) => {
      if (data) {
        this.getschoolsManagementWiseTeacher(data.teacherManagmentWiseCounts);
        this.getShiftWiseSchools(data.teacherShiftWiseCounts);
        let newData = data.teacherCounts.sort((a: any, b: any) => a.teacherCount - b.teacherCount);
        this.getCategoryWiseTeacher(newData);
        this.getDesignation(data.postdescWiseTeacherCounts);
        this.getExperianceOfTeachers(data.experianceOfTeachers);
        this.getSchoolTypeWiseCount(data.teacherTypeOfSchoolWiseCounts);
        this.getStreamWiseCount(data);
        this.getMinorityWiseCount(data.teacherMinorityWiseCounts);
        this.spinner.hide();
      }
      this.spinner.hide();
    })
  }

  getGraphsBySchoolName() {
    const school = {
      schname: this.schoolModel
    }
    this.spinner.show();
    this.httpService.post('teacher-graph/school-category-wise/school', school).subscribe((data: any) => {
      if (data) {
        this.getschoolsManagementWiseTeacher(data.teacherManagmentWiseCounts);
        this.getShiftWiseSchools(data.teacherShiftWiseCounts);
        let newData = data.teacherCounts.sort((a: any, b: any) => a.teacherCount - b.teacherCount);
        this.getCategoryWiseTeacher(newData);
        this.getDesignation(data.postdescWiseTeacherCounts);
        this.getExperianceOfTeachers(data.experianceOfTeachers);
        this.getSchoolTypeWiseCount(data.teacherTypeOfSchoolWiseCounts);
        this.getStreamWiseCount(data);
        this.getMinorityWiseCount(data.teacherMinorityWiseCounts);
        this.spinner.hide();
      }
      this.spinner.hide();
    })
  }

  getAllSchools() {
    this.allSchools = [
      {schname:'Bhola Nath Nagar-SBV (Babu Ram)'},
      {schname:'Kanti Nagar-GGSSS'},
      {schname:'Vivek Vihar,Phase-II-GGSSS'},
      {schname:'Surajmal Vihar-SKV'},
      {schname:'Surajmal Vihar-RPVV'},
      {schname:'Jhilmil Colony-SBV'},
    ]
  }

  getTeachersGenderRatio(teachersGender: any) {
    const series = [teachersGender.totalMaleTeachers, teachersGender.totalFemaleTeachers];
    const categories = ["Male", "Female"];
    this.teacherGenderRatio = this.graphService.PieGraph('donut','');
    this.teacherGenderRatio.series = [...series];
    this.teacherGenderRatio.chart.type = "pie";
    this.teacherGenderRatio.labels = [...categories];
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
    this.schoolsManagementWiseTeacher = this.graphService.PieGraph('donut','')
    for (let i = 0; i < schoolManagementWise.length; i++) {
      if (schoolManagementWise[i].shift == "Government") { var govCount = schoolManagementWise[i].teacherManagmentWiseCount }
      if (schoolManagementWise[i].shift == "Aided") { var aidedCount = schoolManagementWise[i].teacherManagmentWiseCount }
    }
    this.schoolsManagementWiseTeacher.series = [govCount, aidedCount];
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
    this.experienceWiseTeacher.colors= ["#F44F5E"];
    this.experienceWiseTeacher.xaxis.categories = ['0-5 Years', '5-10 Years', '10-15 Years', '15-20 Years', '20-25 Years', '25 + Years'];

  }

  getDesignation(post: any) {
    // this.designation = this.graphService.VerticleBarGraph();
    this.designation = JSON.parse(JSON.stringify(this.commonBarGraph));
    const series: any = [{
      name: "Teacher Count",
      data: []
    }];
    let categories = [];
    for (let i = 0; i < post.length; i++) {
      series[0].data.push(post[i].teacherCount);
      categories.push(post[i]._id);
    }
    this.designation.series = [...series];
    this.designation.dataLabels = {enabled: false};
    this.designation.xaxis.categories = categories;
  }

  getSchoolTypeWiseCount(data: any) {
    this.schoolTypeWiseCount = this.graphService.PolarGraph();
    for (let i = 0; i < data.length; i++) {
      this.schoolTypeWiseCount.series.push(data[i].teacherTypeOfSchoolWiseCount);
      this.schoolTypeWiseCount.labels.push(data[i].typeOfSchool);
    }
  }

  getStreamWiseCount(data: any) {
    this.streamWiseTeacher = this.graphService.PieGraph('pie','');
    this.streamWiseTeacher.series = [90, 150, 200, 320, 12];
    this.streamWiseTeacher.labels = ['Art', 'Science', 'Commerce', 'Vocational', 'Other']
  }

  getMinorityWiseCount(data: any) {
    this.minorityWiseTeacher = this.graphService.PieGraph('donut','');
    for (let i = 0; i < data.length; i++) {
      this.minorityWiseTeacher.series.push(data[i].teacherMinorityWiseCount);
      this.minorityWiseTeacher.labels.push(data[i].minority);
    }
  }
}
