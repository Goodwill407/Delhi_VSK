import { Component } from '@angular/core';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'app-pm-poshan',
  templateUrl: './pm-poshan.component.html',
  styleUrls: ['./pm-poshan.component.css']
})
export class PmPoshanComponent {

  communicationServiceMobile: any;

  constructor(private communicationService: CommunicationService){
    this.communicationServiceMobile = this.communicationService.isMobile;
  }
}
