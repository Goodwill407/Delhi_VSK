import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { GraphService } from 'src/app/services/graph-service.service';

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

  // Single data
  teachersRatio: any;
  totalSchools: any;
  averageTeacherOfSchool: any;
  averageStudentOfSchool: any;
  allDistricts: any;
  districtModel: any = "";
  zoneModel: any = "";
  districtName: any;

  constructor(private httpService: HttpServiceService, private spinner: NgxSpinnerService, private route: ActivatedRoute, private graphService: GraphService) {
  }

  ngOnInit() {
    this.getAllDistricts();
    this.getAllSchoolGraph();
    this.getDistrictName();
  }

  getAllDistricts() {
    this.httpService.get('graphs/school-student-count-by-district').subscribe((data: any) => {
      if (data && data.length > 0) {
        this.allDistricts = data;
      }
    })
  }

  setAllGraphs(data: any) {
    this.teachersRatio = data.teacherStudentRatio?.toFixed(2);
    this.totalSchools = data.totalSchools;
    this.averageStudentOfSchool = data.averageStudentOfSchool?.toFixed(2);
    this.averageTeacherOfSchool = data.averageTeacherOfSchool?.toFixed(2);

    const studentsGender = {
      totalBoys: data.totalBoys,
      totalGirls: data.totalGirls
    }
    this.getStudentsGenderRatio(studentsGender);

    const teachersGender = {
      totalMaleTeachers: data.totalMaleTeachers,
      totalFemaleTeachers: data.totalFemaleTeachers
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
    this.getStreamCount(data.streamCounts);
    this.getMinorityCount(data.minorityCounts);
    this.getAllZones(data.zoneWiseCounts);
  }

  getAllSchoolGraph() {
    this.httpService.get('graphs/school-teacher-student-graph').subscribe((data: any) => {
      if (data) {
        this.setAllGraphs(data);
      }
    })
  }

  getGraphsByZone() {
    this.spinner.show();
    const zone = {
      zoneName: this.zoneModel
    }
    this.httpService.post('zonegraph/school-student-teacher-graph-zonename', zone).subscribe((data: any) => {
      if (data) {
        this.setAllGraphs(data);
        this.spinner.hide();
      }
    }, (error) => {
      this.spinner.hide();
    })
  }

  getGraphsByDistrictName() {
    this.spinner.show();
    const district = {
      districtName: this.districtModel
    }
    this.httpService.post('zonegraph/school-student-teacher-graph-district', district).subscribe((data: any) => {
      if (data) {
        this.setAllGraphs(data);
        this.spinner.hide();
      }
    }, (error) => {
      this.spinner.hide();
    })
  }

  getStudentsGenderRatio(studentsGender: any) {
    this.studentsGenderRatio = this.graphService.PieGraph('donut', ' Students');
    this.studentsGenderRatio.series = [studentsGender.totalBoys, studentsGender.totalGirls];
    this.studentsGenderRatio.labels = ["Boys", "Girls"];
  }

  getTeachersGenderRatio(teachersGender: any) {
    this.teacherGenderRatio = this.graphService.PieGraph('donut', ' Teachers');
    this.teacherGenderRatio.series = [teachersGender.totalMaleTeachers, teachersGender.totalFemaleTeachers];
    this.teacherGenderRatio.labels = ["Male", "Female"];
  }

  getSchoolsByManagement(schoolManagementWise: any) {
    this.schoolsByManagement = this.graphService.PieGraph('donut', ' Schools');
    this.schoolsByManagement.series = [schoolManagementWise.Government, schoolManagementWise.Aided];
    this.schoolsByManagement.labels = ['Government', 'Aided']
  }

  getShiftWiseSchools(shiftWiseCount: any) {
    const series = [shiftWiseCount.Morning, shiftWiseCount.Afternoon, shiftWiseCount.Evening, shiftWiseCount.General]
    this.shiftWiseSchools = this.graphService.PolarGraph();
    this.shiftWiseSchools.series = [...series];
    this.shiftWiseSchools.labels = ['Morning', 'Afternoon', 'Evening', 'General']
  }

  getLowClassHighClass(lowClassHighClass: any) {
    this.lowClassHighClass = this.graphService.PieGraph('donut', ' Schools');
    this.lowClassHighClass.series = [lowClassHighClass.lowClassCount, lowClassHighClass.highClassCount];
    this.lowClassHighClass.labels = ['Low class', 'High class']
  }

  getTypesOfSchools(typesOfSchools: any) {
    this.typesOfSchools = this.graphService.PolarGraph();
    this.typesOfSchools.series = [typesOfSchools[0].count, typesOfSchools[1].count, typesOfSchools[2].count];
    this.typesOfSchools.labels = ["Boys", "Girls", "Co-ed"]
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
    for (let i = 0; i < minorityCount.length; i++) {
      this.minorityCount.series.push(minorityCount[i].count);
      this.minorityCount.labels.push(minorityCount[i].minority);
    }
  }

  getAllZones(allZones: any) {
    this.allZones = this.graphService.TreeGraph();
    for (let i = 0; i < allZones.length; i++) {
      this.allZones.series[0].data.push({ x: allZones[i].zone, y: allZones[i].count });
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

}
