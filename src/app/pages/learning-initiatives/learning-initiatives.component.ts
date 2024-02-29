import { Component } from '@angular/core';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'app-learning-initiatives',
  templateUrl: './learning-initiatives.component.html',
  styleUrls: ['./learning-initiatives.component.css']
})
export class LearningInitiativesComponent {

  communicationServiceMobile: any;

  constructor(private communicationService: CommunicationService) {
    this.communicationServiceMobile = this.communicationService.isMobile;
  }
}
