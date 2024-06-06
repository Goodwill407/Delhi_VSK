import { Component } from '@angular/core';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'app-bird-eye-school',
  templateUrl: './bird-eye-school.component.html',
  styleUrls: ['./bird-eye-school.component.css']
})
export class BirdEyeSchoolComponent {

  communicationServiceMobile: any;

  constructor(private communicationService: CommunicationService) {
    this.communicationServiceMobile = this.communicationService.isMobile;
  }
}