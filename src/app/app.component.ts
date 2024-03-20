import { Component, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommunicationService } from './services/communication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'delhi_dashboard';
  name = "Angular Toggle Show Hide";
  showMyContainer: boolean = false;

  status: boolean = true;
  statusLink: boolean = true;
  isLogIn: boolean = false;
  user: any;
  isMobile: boolean = false;
  showFlag: boolean = false;

  constructor(private router: Router, private communicationService: CommunicationService) {
    this.isMobile = window.innerWidth <= 768 ? true : false;
    this.communicationService.isMobile = this.isMobile;
    this.user = JSON.parse(sessionStorage.getItem('userProfile')!);
    if (!this.user) {
      this.isLogIn = false;
      this.router.navigate(['']);
    } else {
      this.isLogIn = true;
    }
  }

  loginFlagFunc(event: any) {
    this.isLogIn = event;
    this.user = JSON.parse(sessionStorage.getItem('userProfile')!);
  }

  loginFlagFunc2(event: any) {
    this.isLogIn = event;
    this.user = JSON.parse(sessionStorage.getItem('userProfile')!);
  }

  ngOnChanges(change: SimpleChanges) {
    change;
  }

  logout() {
    sessionStorage.clear();
    this.isLogIn = false;
    this.router.navigate(['/']);
  }

  clickEvent() {
    this.status = !this.status;


    if (this.statusLink) {
      setTimeout(() => {
        this.statusLink = false;
      }, 230);
    } else {
      this.statusLink = true;
    }
  }

  sideBarNav() {
    if (this.showFlag) {
      this.showFlag = false;
    } else {
      this.showFlag = true;
    }
  }

}
