import { Component, EventEmitter, Output } from '@angular/core';
import { CommunicationService } from '../services/communication.service';

@Component({
  selector: 'app-login-page-main',
  templateUrl: './login-page-main.component.html',
  styleUrls: ['./login-page-main.component.css']
})
export class LoginPageMainComponent {
  
  isLogIn: boolean = false;
  @Output() loginFlag = new EventEmitter<boolean>(); 

  communicationServiceMobile:any;
  constructor(private communicationService:CommunicationService ){
    this.communicationServiceMobile = this.communicationService.isMobile;
  }

  loginFlagFunc(event: any) {
    this.isLogIn = event;
    this.loginFlag.emit(event)
  }
}
