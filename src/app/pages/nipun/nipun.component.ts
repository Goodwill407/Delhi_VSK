import { Component } from '@angular/core';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'app-nipun',
  templateUrl: './nipun.component.html',
  styleUrls: ['./nipun.component.css']
})
export class NipunComponent {

  communicationServiceMobile: any;

  constructor(private communicationService: CommunicationService){
    this.communicationServiceMobile = this.communicationService.isMobile;
  }
}
