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

  ngOnInit() {
    this.handleParentClick('total');
  }

  handleParentClick(name: any) {
    this.communicationService.setSelectedTab(name);
  }
}