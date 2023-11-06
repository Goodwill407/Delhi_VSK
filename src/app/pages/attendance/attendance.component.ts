import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GraphService } from 'src/app/services/graph-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent {

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
  allData: any;
  allDistricts: any;
  districtModel: any = "";
  zoneModel: any = "";
  dateModel: any = "11/04/2023";
  districtName: any;
  genderWisePresent: any;
  genderWiseAbsent: any;

  constructor(private httpService: HttpServiceService, private spinner: NgxSpinnerService, private route: ActivatedRoute, private graphService: GraphService, public datepipe: DatePipe) {
  }

  ngOnInit() {
    this.getAllDistricts();
    this.getAllSchoolGraph();
    this.getDistrictName();
    // this.dateModel = new Date();
    // this.dateModel.setDate(this.dateModel.getDate() - 1);
    this.getGraphsByDate();
  }

  getAllDistricts() {
    this.httpService.get('graphs/school-student-count-by-district').subscribe((data: any) => {
      if (data && data.length > 0) {
        this.allDistricts = data;
      }
    })
  }

  setAllGraphs(data: any) {
    this.allData = data;
    this.getGenderWisePresent(data);
    this.getGenderWiseAbsent(data);
  }

  getAllSchoolGraph() {
    this.httpService.get('attendance/date-wise').subscribe((data: any) => {
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
    this.httpService.post('attendance/zone/date-wise', zone).subscribe((data: any) => {
      if (data) {
        this.setAllGraphs(data);
        this.districtModel = this.zoneModel;
        this.spinner.hide();
      }
    }, (error) => {
      this.spinner.hide();
    })
  }

  getGraphsByDistrictName() {
    this.spinner.show();
    const district = {
      "date": this.dateModel,
      "districtName": this.districtModel
    }
    this.httpService.post('attendance/district-wise/date-wise', district).subscribe((data: any) => {
      if (data) {
        this.setAllGraphs(data);
        this.spinner.hide();
      }
    }, (error) => {
      this.spinner.hide();
    })
  }


  getGraphsByDate() {

    this.dateModel = this.datepipe.transform(this.dateModel, 'dd/MM/yyyy');
    if (this.districtModel) {
      this.getGraphsByDistrictName();
    }
    if (this.zoneModel) {
      this.getGraphsByZone();
    }
    else {
      let date = { "date": this.dateModel };
      this.httpService.post('attendance/date-wise', date).subscribe((data) => {
        this.setAllGraphs(data);
      });
    }
  }

  getGenderWisePresent(data: any) {
    this.genderWisePresent = this.graphService.PieGraph('pie', '');
    this.genderWisePresent.series = [data.malePresentCount, data.femalePresentCount, data.otherPresentCount];
    this.genderWisePresent.labels = ['Male', 'Female', 'Others']
  }

  getGenderWiseAbsent(data: any) {
    this.genderWiseAbsent = this.graphService.PieGraph('pie', '');
    this.genderWiseAbsent.series = [data.maleAbsentCount, data.femaleAbsentCount, data.otherAbsentCount];
    this.genderWiseAbsent.labels = ['Male', 'Female', 'Others']
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
    this.streamCount = this.graphService.VerticleBarGraph();;
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
