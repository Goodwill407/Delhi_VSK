import { Component, ElementRef, EventEmitter, Inject, Output, SimpleChange, ViewChild } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GraphService } from 'src/app/services/graph-service.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommunicationService } from 'src/app/services/communication.service';
@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent {
  communicationServiceMobile: any;
  constructor(private httpService: HttpServiceService, private spinner: NgxSpinnerService, private graphService: GraphService, private toastr: ToastrService, private communicationService: CommunicationService) {
    this.communicationServiceMobile = this.communicationService.isMobile;
  }

  @ViewChild('tab1') tab1: any;
  @ViewChild('tab2') tab2: any;
  @ViewChild('tab3') tab3: any;
  teacherType: any = 'Total Teacher';
  
  ngOnInit() {
    this.handleParentClick('total');
  }

  handleParentClick(name: any) {
    this.communicationService.setSelectedTab(name);
  }

  selectTeacherType() {
    if (this.teacherType == 'Total Teacher') {
      this.tab1.nativeElement.click();
    }
    else if (this.teacherType == 'Regular Teacher') {
      this.tab2.nativeElement.click();
    }
    else if (this.teacherType == 'Guest Teacher') {
      this.tab3.nativeElement.click();
    }
  }
}