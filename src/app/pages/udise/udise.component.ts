import { Component } from '@angular/core';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'app-udise',
  templateUrl: './udise.component.html',
  styleUrls: ['./udise.component.css']
})
export class UdiseComponent {

  constructor(private communicationService: CommunicationService) { }
  ngOnInit(){
    this.handleParentClick('home');
  }

  handleParentClick(data:any) {
    this.communicationService.setSelectedTab(data);
  }

}
