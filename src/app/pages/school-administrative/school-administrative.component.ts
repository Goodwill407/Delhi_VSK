import { Component } from '@angular/core';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'app-school-administrative',
  templateUrl: './school-administrative.component.html',
  styleUrls: ['./school-administrative.component.css']
})
export class SchoolAdministrativeComponent {

  communicationServiceMobile: any;

  constructor(private communicationService: CommunicationService){
    this.communicationServiceMobile = this.communicationService.isMobile;
  }
}
