import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GraphService } from 'src/app/services/graph-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent {
  totalStudent: any;
  totalBoys: any;
  totalGirls: any;
  commonBarGraph: any
  commonBarGraph2: any
  commonHorizontalBarGraph: any;
  studentsGenderRatio: any
  averageStudentOfSchool: any
  teacherStudentRatio: any
  EnrollMentBySchoolcategories: any
  catogoryWiseStudentCount: any
  commonHorizontalBarGraph2: any
  EnrollMentBySchoolcategoriesGenderWise: any
  communHorisontal2: any
  commonPollarChart: any
  commonPieDonut: any
  maleCounts: any
  femaleCount: any
  otherCount: any
  StreamWiseStudent: any;
  AffiliationWiseStudent: any
  TypeOfStudSchool: any
  MinorityWiseStudCount: any;
  StudentShiftWiseCounts: any
  StudentManagementWiseCounts: any
  StudentStatusWiseCounts:any
  chartOptions: any

  allDistricts: any
  allZones: any;
  districtModel: any = ""
  ZoneModel: any = ""
  AllSchool: any
  schoolModel: any = ""


  constructor(private httpService: HttpServiceService, private spinner: NgxSpinnerService, private route: ActivatedRoute, private graphService: GraphService) { }

  ngOnInit() {
    this.getStudentGraphData()
    this.getAllDistricts()
    this.getAllZones()
    this.getAllSchools();



  }
  getAllDistricts() {
    this.httpService.get('graphs/school-student-count-by-district').subscribe((data: any) => {
      if (data && data.length > 0) {
        this.allDistricts = data;
      }
    })
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


  getStudentGraphData() {
    this.spinner.show();
    this.httpService.get('all-student-graph/student-graph-count').subscribe((data: any) => {
      if (data) {
        this.setAllGraphData(data)
        this.spinner.hide();
      }
    })
  }

  getGraphsByDistrictName() {
    this.spinner.show();
    const district = {
      districtName: this.districtModel
    }
    this.httpService.post('studentgraph/student-graph-count-districtname', district).subscribe((data: any) => {
      if (data) {
        this.setAllGraphData(data);
        this.getAllZones()
        this.getAllSchools()
        this.spinner.hide();
      }
    }, (error) => {
      this.spinner.hide();
    })
    this.ZoneModel = '';
    this.schoolModel = '';
    this.spinner.hide();
  }

  getGraphsByZone() {
    this.spinner.show();
    const zone = {
      zoneName: this.ZoneModel
    }
    this.httpService.post('studentgraph/student-graph-count-zonename', zone).subscribe((data: any) => {
      if (data) {
        this.setAllGraphData(data);

      }
    }, (error) => {
      this.spinner.hide();
    });
    this.schoolModel = '';
    // this.districtModel='';
    this.getAllSchools();
    this.spinner.hide();

  }

  getGraphsBySchoolName() {
    const school = {
      schoolName: this.schoolModel
    }
    this.spinner.show();
    this.httpService.post('studentgraph/student-graph-count-schoolName', school).subscribe((data: any) => {
      if (data) {
        this.setAllGraphData(data);
        this.spinner.hide();
      }
      this.spinner.hide();
    })
  }

  getAllSchools() {
    if (this.districtModel && !this.ZoneModel) {
      const district = {
        District_name: this.districtModel
      }
      this.httpService.post('school/getDistrictSchool', district).subscribe((data: any) => {
        if (data && data.districtSchools) {
          this.AllSchool = data.districtSchools;
        } else {
          this.AllSchool = [];
        }
      });
    } else {
      const zone = {
        Zone_Name: this.ZoneModel
      }
      this.httpService.post('school/getZoneSchool', zone).subscribe((data: any) => {
        if (data && data.ZoneSchool) {
          this.AllSchool = data.ZoneSchool;
        } else {
          this.AllSchool = [];
        }
      });
    }
  }

  setAllGraphData(data: any) {
    this.totalStudent = data.totalStudents;
    this.teacherStudentRatio = data.teacherStudentRatio;
    this.averageStudentOfSchool = data.averageStudentOfSchool;
    const StudentGenderWise = data.studentGenderCounts

    const catogoryWiseStudentCount = data.studentStats[0].SchCategory
    // const StreanWiseCount = data.studentStats[0].
    // const AffiliationWiseCount = data.affiliationWiseCount
    const TypeOfStudSchool = data.studentStats[1].typeOfSchool
    // const MinorityWiseStudCount = data.minortyWiseCount
    const StudentShiftWiseCounts = data.studentStats[2].shift
    const StudentManagementWiseCounts = data.studentStats[3].SchManagement
    const studentManagementWiseCounts = data.studentStatusCounts

    this.getStudentsGenderRatio(StudentGenderWise)
    this.getStudentCatogoryWise(catogoryWiseStudentCount)
    // this.getStreamWiseStudent(StreanWiseCount)
    // this.getAffiliationWiseCount(AffiliationWiseCount)
    this.getTypeOfStudSchool(TypeOfStudSchool)
    // this.getMinorityWiseCount(MinorityWiseStudCount)
    this.getStudentShiftWiseCounts(StudentShiftWiseCounts)
    this.getStudentManagementWiseCounts(StudentManagementWiseCounts)
    this.getStudentStatusWiseCounts(studentManagementWiseCounts)


  }

  getStudentsGenderRatio(studentsGender: any) {
let Male_Count = 0;
let Female_Count = 0;
let Other_Count = 0;
studentsGender.forEach((item:any) => {
  switch (item._id) {
    case "M":
      Male_Count = item.count;
      break;
    case "F":
      Female_Count = item.count;
      break;
    case "T":
      Other_Count = item.count;
      break;
    
  }
})
    const series = [Male_Count, Female_Count, Other_Count]
    const labels = [
      "Boys", "Girls", 'Other'
    ]
    this.studentsGenderRatio = this.graphService.PieGraph('donut', ' student')
    this.studentsGenderRatio.series = [...series];
    this.studentsGenderRatio.labels = [...labels];
  }

  getStudentCatogoryWise(catogoryWiseStudentCount: any) {
    const categories = catogoryWiseStudentCount.map((category:any) => category.SchCategory);
    const counts = catogoryWiseStudentCount.map((category:any) => category.count);
    this.chartOptions = this.graphService.VerticleBarGraph()
    const series: any = [{
      name: "Count",
      data: counts
    }];
    const labels = categories;
    this.chartOptions.series = [...series]
    this.chartOptions.labels = [...labels]
    this.chartOptions.plotOptions.bar.horizontal = true
  };

  getStreamWiseStudent(StreanWiseCount: any) {
    const Stream = StreanWiseCount.map((item: any) => item.stream);
    const StreamWiseStudCount = StreanWiseCount.map((item: any) => item.count);
    const series = [{
      name: [""],
      data: StreamWiseStudCount
    }];
    const labels = Stream
    this.StreamWiseStudent = this.graphService.VerticleBarGraph();
    this.StreamWiseStudent.series = [...series];
    this.StreamWiseStudent.labels = [...labels];
    this.StreamWiseStudent.plotOptions.bar.horizontal = false
  }

  getAffiliationWiseCount(affiliationWiseCount: any) {
    const Affiliation = affiliationWiseCount.map((item: any) => item.affiliation)
    const affiliationWiseStud = affiliationWiseCount.map((item: any) => item.count)
    this.AffiliationWiseStudent = this.graphService.PieGraph('donut', ' student');
    const series = affiliationWiseStud;
    const labels = Affiliation
    this.AffiliationWiseStudent.series = [...series];
    this.AffiliationWiseStudent.labels = [...labels]
  }

  getTypeOfStudSchool(TypeOfStudSchool: any) {
    const TypeOfSchool = TypeOfStudSchool.map((item: any) => item.typeOfSchool)
    const TypeOfStudCount = TypeOfStudSchool.map((item: any) => item.count)
    this.TypeOfStudSchool = this.graphService.PieGraph('pie', ' student');
    const series = TypeOfStudCount;
    const labels = TypeOfSchool
    this.TypeOfStudSchool.series = [...series];
    this.TypeOfStudSchool.labels = [...labels]
    this.TypeOfStudSchool.chart.type = "pie";
  }

  getMinorityWiseCount(minorityWiseStudCount: any) {
    const Minority = minorityWiseStudCount.map((item: any) => item.minority)
    const StudCount = minorityWiseStudCount.map((item: any) => item.count)
    this.MinorityWiseStudCount = this.graphService.PieGraph('pie', ' student');
    const series = StudCount;
    const labels = Minority
    this.MinorityWiseStudCount.series = [...series];
    this.MinorityWiseStudCount.labels = [...labels]
    this.MinorityWiseStudCount.chart.type = "pie";
  }

  getStudentShiftWiseCounts(StudentShiftWiseCounts: any) {
    const shift = StudentShiftWiseCounts.map((item: any) => item.shift)
    const StudCount = StudentShiftWiseCounts.map((item: any) => item.count)
    this.StudentShiftWiseCounts = this.graphService.PolarGraph();
    const series = StudCount;
    const labels = shift
    this.StudentShiftWiseCounts.series = [...series];
    this.StudentShiftWiseCounts.labels = [...labels]
  }

  getStudentManagementWiseCounts(StudentManagementWiseCounts: any) {
    const SchManagement = StudentManagementWiseCounts.map((item: any) => item.SchManagement)
    const StudCount = StudentManagementWiseCounts.map((item: any) => item.count)
    this.StudentManagementWiseCounts = this.graphService.PieGraph('donut', ' student');
    const series = StudCount;
    const labels = SchManagement
    this.StudentManagementWiseCounts.series = [...series];
    this.StudentManagementWiseCounts.labels = [...labels]
  }

  getStudentStatusWiseCounts(StudentstatusWiseCounts: any) {
    const StudentStatus = StudentstatusWiseCounts.map((item: any) => item._id)
    const StudCount = StudentstatusWiseCounts.map((item: any) => item.count)
    this.StudentStatusWiseCounts = this.graphService.PieGraph('donut', ' student');
    const series = StudCount;
    const labels = StudentStatus
    this.StudentStatusWiseCounts.series = [...series];
    this.StudentStatusWiseCounts.labels = [...labels]
  }


}


