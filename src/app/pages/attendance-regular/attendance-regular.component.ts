import { DatePipe } from '@angular/common';
import { Component, SimpleChange, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
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
 districtModel: any = "";
 zoneModel: any = "";
 shiftModel: any = "";
 dateModel: any;
 districtName: any;
 genderWisePresent: any;
 genderWiseAbsent: any;
 allShift: any = ['Morning', 'General', 'Evening'];
 districtWiseAttendanceCount: any;
 newDate: any
 formattedDate: any;

 constructor(private communicationService: CommunicationService,private httpService: HttpServiceService, private spinner: NgxSpinnerService, private route: ActivatedRoute, private graphService: GraphService, public datepipe: DatePipe) {

 }

 ngOnInit() {
   this.dateModel = new Date();
   this.dateModel.setDate(this.dateModel.getDate() - 1);
   this.formattedDate = this.datepipe.transform(this.dateModel, 'dd-MMM-yyyy');
   this.getAllSchoolGraph();
   this.getGraphsByDate();
   this.getAllDistricts();
   this.getAllZones();
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
     }
   })
 }

 getAllSchoolGraph() {
   this.httpService.get('attendance/date-wise').subscribe((data: any) => {
     if (data) {
       this.setAllGraphs(data);
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
       this.allZones = res.ZoneInfo;
     })
   }
 }

 getGraphsByZone() {
   this.spinner.show();
   const zone = {
     date: this.getDate(this.dateModel),
     zoneName: this.zoneModel
   }
   this.httpService.post('attendance/zone/date-wise', zone).subscribe((data: any) => {
     if (data) {
       this.setAllGraphs(data);
       this.spinner.hide();
       this.shiftModel = '';
     }
   }, (error) => {
     this.spinner.hide();
   })
 }

 getGraphsByDistrictName() {
   if (this.districtModel) {
     this.spinner.show();
     const district = {
       "date": this.getDate(this.dateModel),
       "districtName": this.districtModel
     }
     this.httpService.post('attendance/district-wise/date-wise', district).subscribe((data: any) => {
       if (data) {
         this.setAllGraphs(data);
         this.getAllZones();
         this.spinner.hide();
         this.zoneModel = '';
         this.shiftModel = '';
       }
     }, (error) => {
       this.spinner.hide();
     });
   } else {
     this.getGraphsByDate();
   }
 }


 getGraphsByDate() {
   this.formattedDate = this.datepipe.transform(this.dateModel, 'dd-MMM-yyyy');
   if (this.districtModel) {
     this.getGraphsByDistrictName();
   } else if (this.zoneModel) {
     this.getGraphsByZone();
   } else if (this.shiftModel) {
     this.getGraphsBySfhit();
   }
   else {
     let date = { "date": this.getDate(this.dateModel) };
     this.httpService.post('attendance/date-wise', date).subscribe((data) => {
       this.setAllGraphs(data);
       // this.shiftModel = '';
       // if (data.totalStudentCount == 0) {
       //   this.dateModel.setDate(this.dateModel.getDate() - 1);
       //   this.getGraphsByDate();
       // }
       this.setDistrictWiseGraph();
       this.formattedDate = this.datepipe.transform(this.dateModel, 'dd-MMM-yyyy');
     });
   }
 }

 getGraphsBySfhit() {
   if (this.shiftModel) {
     this.spinner.show();
     const shift = {
       "shift": this.shiftModel,
       "date": this.getDate(this.dateModel)
     }
     this.httpService.post('attendance/zone/shift/wise', shift).subscribe((data: any) => {
       if (data) {
         this.setAllGraphs(data);
         this.districtModel = '';
         this.zoneModel = '';
         this.getAllZones();
         this.spinner.hide();
       }
     }, (error) => {
       this.spinner.hide();
     });
   }
 }


 setAllGraphs(data: any) {
   this.allData = data;
   this.getGenderWisePresent(data);
   this.getGenderWiseAbsent(data);
   this.setDistrictWiseGraph();
 }

 setDistrictWiseGraph() {
   let date = { "date": this.getDate(this.dateModel) };
   this.httpService.post('attendance/district/present-student/per', date).subscribe((data: any) => {
     if (data) {
       this.districtWiseAttendanceCount = data;
       this.getdistrictWiseGraph(data);
     }
   })
 }

 getGenderWisePresent(data: any) {
   this.genderWisePresent = this.graphService.PieGraph('pie', ' Students');
   this.genderWisePresent.series = [data.malePresentCount, data.femalePresentCount, data.otherPresentCount];
   this.genderWisePresent.labels = ['Male', 'Female', 'Others']
 }

 getGenderWiseAbsent(data: any) {
   this.genderWiseAbsent = this.graphService.PieGraph('pie', ' Students');
   this.genderWiseAbsent.series = [data.maleAbsentCount, data.femaleAbsentCount, data.otherAbsentCount];
   this.genderWiseAbsent.labels = ['Male', 'Female', 'Others']
 }

 getdistrictWiseGraph(data: any) {
   this.districtWiseGraph = this.graphService.districtWiseGraph();
   for (let i = 0; i < data.length; i++) {
     this.districtWiseGraph.series[0].data.push(Number(data[i].presentPercentage.toFixed(0)));
     this.districtWiseGraph.series[1].data.push(Number((100 - data[i].presentPercentage).toFixed(0)));
     this.districtWiseGraph.xaxis.categories.push(data[i]._id);
   }
 }

}
