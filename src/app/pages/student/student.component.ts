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
  chartOptions: any

  allDistricts: any
  allZones:any;
  districtModel: any = ""
  ZoneModel :any = ""
  AllSchool :any
  schoolModel:any=""


  constructor(private httpService: HttpServiceService, private spinner: NgxSpinnerService, private route: ActivatedRoute, private graphService: GraphService) { }

  ngOnInit() {
    this.getStudentGraphData()
    this.getAllDistricts()
    this.getAllZone()
    this.getSchoolByZone()
    
   

  }
  getAllDistricts() {
    this.httpService.get('graphs/school-student-count-by-district').subscribe((data: any) => {
      if (data && data.length > 0) {
        this.allDistricts = data;
      }
    })
  }
  getAllZone() {
    this.httpService.get('school/zonename').subscribe((data: any) => {
      if (data) {
        this.allZones = data.ZoneNames
       
      }
    })
  }

  getZoneDistricWise(){
    const district = {
      District_name: 'East'
    };
    this.httpService.post('school/getDistrictZone', district)
      .subscribe((data: any) => {
        if (data) {
          this.allZones = data.ZoneSchool;
          
        }
      });

  }
  
  getSchoolsByDistrict() {
    const district = {
      District_name: this.districtModel
    };
    this.httpService.post('school/getDistrictSchool', district)
      .subscribe((data: any) => {
        if (data) {
          this.AllSchool = data.districtSchools;
         
        }
      });
  }

  getSchoolByZone() {
    const Zone = {
      Zone_Name: this.ZoneModel
    };
    this.httpService.post('school/getZoneSchool', Zone)
      .subscribe((data: any) => {
        if (data) {
          this.AllSchool = data.districtSchools;
          
        }
      });
  }
   
  getStudentGraphData() {
    this.spinner.show();
    this.httpService.get('studentgraph/student-graph-count').subscribe((data: any) => {
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
       this. getZoneDistricWise()
        this.spinner.hide();
      }
    }, (error) => {
      this.spinner.hide();
    })
    this.ZoneModel = '';
    this.schoolModel = '';
  }

  getGraphsByZone() {
    this.spinner.show();
    const zone = {
      zoneName: this.ZoneModel
    }
    this.httpService.post('zonegraph/school-student-teacher-graph-zonename', zone).subscribe((data: any) => {
      if (data) {
        this.setAllGraphData(data);
        this.getSchoolByZone()
        this.spinner.hide();
      }
    }, (error) => {
      this.spinner.hide();
    })
  }

  setAllGraphData(data: any) {
    this.totalStudent = data.studentCount[0].totalStudents;
    this.teacherStudentRatio = data.averageTeacherOfSchool;
    this.averageStudentOfSchool = data.averageStudentOfSchool;
    const StudentGenderWise = data.studentCount[0]

    const catogoryWiseStudentCount = data.SchCategoryCount
    const StreanWiseCount = data.streamWiseCount
    const AffiliationWiseCount = data.affiliationWiseCount
    const TypeOfStudSchool = data.typeOfSchoolWiseCounts
    const MinorityWiseStudCount = data.minortyWiseCount
    const StudentShiftWiseCounts = data.studentShiftWiseCounts
    const StudentManagementWiseCounts = data.managementWiseCount

    this.getStudentsGenderRatio(StudentGenderWise)
    this.getStudentCatogoryWise(catogoryWiseStudentCount)
    this.getStreamWiseStudent(StreanWiseCount)
    this.getAffiliationWiseCount(AffiliationWiseCount)
    this.getTypeOfStudSchool(TypeOfStudSchool)
    this.getMinorityWiseCount(MinorityWiseStudCount)
    this.getStudentShiftWiseCounts(StudentShiftWiseCounts)
    this.getStudentManagementWiseCounts(StudentManagementWiseCounts)
    this.getSchoolsByDistrict()
    this.getSchoolsByDistrict()

  }

  getStudentsGenderRatio(studentsGender: any) {
    const Male_Count = studentsGender.maleStudents
    const Female_Count = studentsGender.femaleStudents
    const Other_Count = studentsGender.otherStudents
    const series = [Male_Count,Female_Count,Other_Count]
    const labels = [
      "Boys", "Girls", 'Other'
    ]
    this.studentsGenderRatio = this.graphService.PieGraph('donut', ' student')
    this.studentsGenderRatio.series = [...series];
    this.studentsGenderRatio.labels = [...labels];
     }

  getStudentCatogoryWise(catogoryWiseStudentCount: any) {
    const StudentCount = catogoryWiseStudentCount.map((item: any) => item.count);
    const SchCategory = catogoryWiseStudentCount.map((item: any) => item._id);
    this.chartOptions = this.graphService.VerticleBarGraph()
    const series: any = [{
      name: "Count",
      data: StudentCount
    }];
    const labels = SchCategory;
    this.chartOptions.series = [...series]
    this.chartOptions.labels = [...labels]
    this.chartOptions.plotOptions.bar.horizontal = true
  };

  getStreamWiseStudent(StreanWiseCount: any) {
    const Stream = StreanWiseCount.map((item: any) => item._id);
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
    const Affiliation = affiliationWiseCount.map((item: any) => item._id)
    const affiliationWiseStud = affiliationWiseCount.map((item: any) => item.count)
    this.AffiliationWiseStudent = this.graphService.PieGraph('donut', ' student');
    const series = affiliationWiseStud;
    const labels = Affiliation
    this.AffiliationWiseStudent.series = [...series];
    this.AffiliationWiseStudent.labels = [...labels]
  }

  getTypeOfStudSchool(TypeOfStudSchool: any) {
    const TypeOfSchool = TypeOfStudSchool.map((item: any) => item._id)
    const TypeOfStudCount = TypeOfStudSchool.map((item: any) => item.count)
    this.TypeOfStudSchool = this.graphService.PieGraph('pie', ' student');
    const series = TypeOfStudCount;
    const labels = TypeOfSchool
    this.TypeOfStudSchool.series = [...series];
    this.TypeOfStudSchool.labels = [...labels]
    this.TypeOfStudSchool.chart.type = "pie";
  }

  getMinorityWiseCount(minorityWiseStudCount: any) {
    const Minority = minorityWiseStudCount.map((item: any) => item._id)
    const StudCount = minorityWiseStudCount.map((item: any) => item.count)
    this.MinorityWiseStudCount = this.graphService.PieGraph('pie', ' student');
    const series = StudCount;
    const labels = Minority
    this.MinorityWiseStudCount.series = [...series];
    this.MinorityWiseStudCount.labels = [...labels]
    this.MinorityWiseStudCount.chart.type = "pie";
  }

  getStudentShiftWiseCounts(StudentShiftWiseCounts: any) {
    const shift = StudentShiftWiseCounts.map((item: any) => item._id)
    const StudCount = StudentShiftWiseCounts.map((item: any) => item.count)
    this.StudentShiftWiseCounts = this.graphService.PolarGraph();
    const series = StudCount;
    const labels = shift
    this.StudentShiftWiseCounts.series = [...series];
    this.StudentShiftWiseCounts.labels = [...labels]
  }

  getStudentManagementWiseCounts(StudentManagementWiseCounts: any) {
    const SchManagement = StudentManagementWiseCounts.map((item: any) => item._id)
    const StudCount = StudentManagementWiseCounts.map((item: any) => item.count)
    this.StudentManagementWiseCounts = this.graphService.PieGraph('donut', ' student');
    const series = StudCount;
    const labels = SchManagement
    this.StudentManagementWiseCounts.series = [...series];
    this.StudentManagementWiseCounts.labels = [...labels]
  }


}


