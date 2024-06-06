import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommunicationService } from 'src/app/services/communication.service';
import { GraphService } from 'src/app/services/graph-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent {
  communicationServiceMobile: any;
  dateModel: any;
  allData: any;
  aided_graphData: any;
  formattedDate: any;

  constructor(private communicationService: CommunicationService, private httpService: HttpServiceService, public datepipe: DatePipe, private graphService: GraphService, private spinner: NgxSpinnerService, private toastr: ToastrService) {
    this.communicationServiceMobile = this.communicationService.isMobile;

  }

  ngOnInit() {
    this.communicationService.sharedData$.subscribe(data => {
      if (data == "aided") {
        this.getDataAidedSchool();
      }
    })
    this.dateModel = new Date();
    this.dateModel.setDate(this.dateModel.getDate() - 1);
    this.formattedDate = this.datepipe.transform(this.dateModel, 'dd-MMM-yyyy');
    this.handleParentClick('regular')
  }

  getDate(date: any) {
    let Mdate: any;
    return Mdate = this.datepipe.transform(date, 'yyyy-MM-dd');
  }
  handleParentClick(name: any) {
    this.communicationService.setSelectedTab(name);
  }


  getDataAidedSchool() {
    this.formattedDate = this.datepipe.transform(this.dateModel, 'dd-MMM-yyyy');
    this.spinner.show();
    this.httpService.post('attendance/attendancecout/aidedschools', { date: this.getDate(this.dateModel) }).subscribe(res => {
      if (res.attendanceCounts) {
        this.allData = res;
        this.getAidedGraphData(res.attendanceCounts);
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.toastr.error('', 'Data not found for this date');
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error('', 'Something Went Wrong ..!')
    })
  }

  getAidedGraphData(data: any) {
    this.aided_graphData = this.graphService.PieGraph('donut', ' Students');
    this.aided_graphData.series = [data.totalPresentCount, data.totalAbsentCount, data.totalLeaveCount, data.totalAttendanceNotMarked];
    this.aided_graphData.labels = ['Present', 'Absent', 'Leave', 'Not Mark'];
  }

}
