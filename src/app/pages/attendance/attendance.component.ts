import { DatePipe } from '@angular/common';
import { Component, SimpleChange, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommunicationService } from 'src/app/services/communication.service';
import { GraphService } from 'src/app/services/graph-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent {

  constructor(private communicationService: CommunicationService) { }

  ngOnInit() {

  }

  handleParentClick() {
    this.communicationService.emitParentClick();
  }

  
}
