import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { CommunicationService } from 'src/app/services/communication.service';
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
  StudentStatusWiseCounts: any
  StudentCatogoryWiseCount: any

  allDistricts: any
  allZones: any;
  districtModel: any = ""
  ZoneModel: any = ""
  AllSchool: any
  schoolModel: any = ""
  allStudentData: any
  allData: any;

  itemCount: number | undefined;
  subscription: Subscription | undefined;
  @ViewChild('openModal') openModal: any;

  configGender: any;
  config: any;
  commonName: any;
  statusWise: any;
  searchBox: any;
  communicationServiceMobile: any;

  constructor(private httpService: HttpServiceService, private spinner: NgxSpinnerService, private route: ActivatedRoute, private graphService: GraphService, private communicationService: CommunicationService) {
    this.communicationServiceMobile = this.communicationService.isMobile;
   }

  ngOnInit() {
    this.getStudentGraphData();
    this.getAllDistricts();
    this.getAllZones();

    this.subscription = this.graphService
      .getItemCountObservable()
      .subscribe((count) => {
        this.itemCount = count;
        if (this.itemCount && this.schoolModel && this.configGender) {
          this.getStudentByGender(false);
        }
        else if (this.itemCount && this.schoolModel && this.commonName) {
          this.getStudentCountBySchoolId(false);
        }
        else if (this.itemCount && this.schoolModel && (this.statusWise != null || !this.statusWise)) {
          this.getStudentByStatusWise(false);
        }
      });

  }
  getAllDistricts() {
    this.httpService.get('school/districtNames').subscribe((data: any) => {
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
        this.allZones = res.ZoneSchool.map((zone: any) => ({ id: zone.Z_ID, name: zone.Zone_Name }));
      })
    } else {
      this.httpService.get('school/zonename').subscribe((res: any) => {
        this.allZones = res.ZoneInfo.map((zone: any) => ({ id: zone.Z_ID, name: zone.Zone_Name }));
        this.allZones = this.allZones.sort((a: any, b: any) => a.id - b.id);
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
    this.ZoneModel = '';
    this.httpService.post('all-student-graph/student-graph-count-districtname', district).subscribe((data: any) => {
      if (data) {
        this.setAllGraphData(data);
        this.getAllZones()
        this.getAllSchools()
      } else {
        this.getAllZones();
      }
      this.ZoneModel = '';
      this.schoolModel = '';
      this.spinner.hide();
    }, (error) => {
      this.spinner.hide();
    });
  }

  getGraphsByZone() {
    this.spinner.show();
    const zone = {
      zoneName: this.ZoneModel
    }

    this.httpService.post('all-student-graph/student-graph-count-zonename', zone).subscribe((data: any) => {
      if (data) {
        this.setAllGraphData(data);

      }
      this.spinner.hide();
    }, (error) => {
      this.spinner.hide();
    });
    this.schoolModel = '';
    // this.districtModel = '';
    this.getAllSchools();


  }

  getGraphsBySchoolName() {
    const school = {
      schoolName: this.schoolModel.Schoolid.toString()
    }
    this.spinner.show();
    this.httpService.post('all-student-graph/student-graph-count-schoolName', school).subscribe((data: any) => {
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
    } else if (this.ZoneModel) {
      const zone = {
        Zone_Name: this.ZoneModel
      }
      this.httpService.post('school/getZoneSchool', zone).subscribe((data: any) => {
        if (data && data.ZoneSchool) {
          this.AllSchool = data.ZoneSchool;
          this.AllSchool = this.AllSchool.sort((a: any, b: any) => a.Schoolid - b.Schoolid);
        } else {
          this.AllSchool = [];
        }
      });
    }
  }

  getStudentBySchoolName() {
    const parameter = {
      "schoolName": this.schoolModel.Schoolid.toString()
    };
    // this.teacherDataClear();
    this.httpService.post('all-student-graph/student-graph-count-schoolName', parameter).subscribe((res: any) => {
      this.allStudentData = res;
      if (this.schoolModel) {
        this.openModal.nativeElement.click();
      }
    });
  }

  setAllGraphData(data: any) {
    this.allData = data;
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
    studentsGender.forEach((item: any) => {
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
    this.studentsGenderRatio = this.graphService.PieGraph('donut', ' Students')
    this.studentsGenderRatio.series = [...series];
    this.studentsGenderRatio.labels = [...labels];
    this.studentsGenderRatio.chart.events = {
      dataPointSelection: (event: any, chartContext: any, config: any) => {
        this.studentDataClear();
        this.configGender = config;
        const parameter = {
          "gender": config.dataPointIndex == 0 ? 'Male' : 'Female',
          "schname": this.schoolModel
        }
        this.graphService.addToCart();
      }
    }
  }



  getStudentCatogoryWise(catogoryWiseStudentCount: any) {
    const categories = catogoryWiseStudentCount.map((category: any) => category.SchCategory);
    const counts = catogoryWiseStudentCount.map((category: any) => category.count);
    this.StudentCatogoryWiseCount = this.graphService.VerticleBarGraph()
    const series: any = [{
      name: "Students",
      data: counts
    }];
    const labels = categories;
    this.StudentCatogoryWiseCount.series = [...series]
    this.StudentCatogoryWiseCount.xaxis.categories = [...labels]
    this.StudentCatogoryWiseCount.plotOptions.bar.horizontal = true
    this.StudentCatogoryWiseCount.chart.events = {
      dataPointSelection: (event: any, chartContext: any, config: any) => {
        this.studentDataClear();
        this.commonName = `Category : ( ${catogoryWiseStudentCount[0].SchCategory} )`;
        const parameter = {
          "Schoolid": this.schoolModel
        }
        this.graphService.addToCart();
      }
    }
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
    this.AffiliationWiseStudent = this.graphService.PieGraph('donut', ' Students');
    const series = affiliationWiseStud;
    const labels = Affiliation
    this.AffiliationWiseStudent.series = [...series];
    this.AffiliationWiseStudent.labels = [...labels]
  }

  getTypeOfStudSchool(TypeOfStudSchool: any) {
    const TypeOfSchool = TypeOfStudSchool.map((item: any) => item.typeOfSchool !== "" ? item.typeOfSchool : "Not Identified")
    const TypeOfStudCount = TypeOfStudSchool.map((item: any) => item.count)
    this.TypeOfStudSchool = this.graphService.PieGraph('pie', ' Students');
    const series = TypeOfStudCount;
    const labels = TypeOfSchool
    this.TypeOfStudSchool.series = [...series];
    this.TypeOfStudSchool.labels = [...labels]
    this.TypeOfStudSchool.chart.type = "pie";
    this.TypeOfStudSchool.chart.events = {
      dataPointSelection: (event: any, chartContext: any, config: any) => {
        this.studentDataClear();
        this.commonName = `School Type : ( ${TypeOfStudSchool[0].typeOfSchool} School )`;
        const parameter = {
          "Schoolid": this.schoolModel
        }
        this.graphService.addToCart();
      }
    }
  }

  getMinorityWiseCount(minorityWiseStudCount: any) {
    const Minority = minorityWiseStudCount.map((item: any) => item.minority)
    const StudCount = minorityWiseStudCount.map((item: any) => item.count)
    this.MinorityWiseStudCount = this.graphService.PieGraph('pie', ' Students');
    const series = StudCount;
    const labels = Minority
    this.MinorityWiseStudCount.series = [...series];
    this.MinorityWiseStudCount.labels = [...labels]
    this.MinorityWiseStudCount.chart.type = "pie";
  }

  getStudentShiftWiseCounts(StudentShiftWiseCounts: any) {
    const shift = StudentShiftWiseCounts.map((item: any) => item.shift)
    const StudCount = StudentShiftWiseCounts.map((item: any) => item.count)
    this.StudentShiftWiseCounts = this.graphService.PolarGraph('Students');
    const series = StudCount;
    const labels = shift
    this.StudentShiftWiseCounts.series = [...series];
    this.StudentShiftWiseCounts.labels = [...labels]
    this.StudentShiftWiseCounts.chart.events = {
      dataPointSelection: (event: any, chartContext: any, config: any) => {
        this.studentDataClear();
        this.commonName = this.commonName = `Sift Wise : ( ${StudentShiftWiseCounts[0].shift} )`;
        const parameter = {
          "Schoolid": this.schoolModel
        }
        this.graphService.addToCart();
      }
    }
  }

  getStudentManagementWiseCounts(StudentManagementWiseCounts: any) {
    const SchManagement = StudentManagementWiseCounts.map((item: any) => item.SchManagement)
    const StudCount = StudentManagementWiseCounts.map((item: any) => item.count)
    this.StudentManagementWiseCounts = this.graphService.PieGraph('donut', ' Students');
    const series = StudCount;
    const labels = SchManagement
    this.StudentManagementWiseCounts.series = [...series];
    this.StudentManagementWiseCounts.labels = [...labels]
    this.StudentManagementWiseCounts.chart.events = {
      dataPointSelection: (event: any, chartContext: any, config: any) => {
        this.studentDataClear();
        this.commonName = this.commonName = `Management Wise : ( ${StudentManagementWiseCounts[0].SchManagement} )`;
        const parameter = {
          "Schoolid": this.schoolModel
        }
        this.graphService.addToCart();
      }
    }
  }

  getStudentStatusWiseCounts(StudentstatusWiseCounts: any) {
    const StudentStatus = StudentstatusWiseCounts.map((item: any) => (item._id !== "" ? item._id : "Not Identified"));
    const StudCount = StudentstatusWiseCounts.map((item: any) => item.count)
    this.StudentStatusWiseCounts = this.graphService.PieGraph('donut', ' Students');
    const series = StudCount;
    const labels = StudentStatus
    this.StudentStatusWiseCounts.series = [...series];
    this.StudentStatusWiseCounts.labels = [...labels]
    this.StudentStatusWiseCounts.chart.events = {
      dataPointSelection: (event: any, chartContext: any, config: any) => {
        this.studentDataClear();
        this.statusWise = config.dataPointIndex
        this.graphService.addToCart();
      }
    }
  }

  // for pop
  studentDataClear() {
    this.configGender = null;
    this.commonName = null;
    this.statusWise = null;
    this.allStudentData = [];
  }
  getStudentByGender(flash: any) {
    if (!flash) {
      this.spinner.show();
      const parameter = {
        "Gender": this.configGender?.dataPointIndex == 0 ? 'M' : (this.configGender?.dataPointIndex == 1) ? 'F' : 'T',
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

  getStudentCountBySchoolId(flash: any) {
    if (!flash) {
      this.spinner.show();
      const parameter = {
        "Schoolid": this.schoolModel.Schoolid,
      }
      this.httpService.post('student/studentcount/schoolname', parameter).subscribe((res: any) => {
        this.allStudentData = res;
        if (!flash) {
          this.openModal.nativeElement.click();
        }
        this.spinner.hide();
      })
    }
  }

  getStudentByStatusWise(flash: any) {
    if (!flash) {
      this.spinner.show();
      const parameter = {
        "Schoolid": this.schoolModel.Schoolid,
        "status": this.allData.studentStatusCounts[this.statusWise]._id
      }
      this.httpService.post('student/studentcount/schoolId/status', parameter).subscribe((res: any) => {
        this.allStudentData = res;
        if (!flash) {
          this.openModal.nativeElement.click();
        }
        this.spinner.hide();
      })
    }
  }

}


