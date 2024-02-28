import { Component } from '@angular/core';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  communicationServiceMobile: any;
  constructor(private communicationService: CommunicationService){
    this.communicationServiceMobile = this.communicationService.isMobile;
  }
}
