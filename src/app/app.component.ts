import { Component, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {
    const user: any = JSON.parse(sessionStorage.getItem('userProfile')!);
    if (!user) {
      this.isLogIn = false;
      this.router.navigate(['']);
    } else {
      this.isLogIn = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    changes;
  }

  loginFlagFunc(event: any) {
    if (event) {
      this.isLogIn = event;
    }
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

  // @ViewChild('sidebar') sidebar: any;
  // @ViewChild('navbar') navbar: any;

  // public data: Object[] = [{ x: 'WW', y: 38.3, text: 'World Wide' },
  // { x: 'EU', y: 45.2, text: 'Europe' },
  // { x: 'APAC', y: 18.2, text: 'Asia Pacific' },
  // { x: 'LATAM', y: 46.7, text: 'Latin America' },
  // { x: 'MEA', y: 61.5, text: 'Middle East Africa' },
  // { x: 'NA', y: 64, text: 'North America' }];

  // public primaryXAxis: Object = {
  //   valueType: 'Category',
  // };

  // chartOptions: any;

  // constructor() {

  // }

  // toggleSidebar() {
  //   if (this.sidebar.nativeElement.className == "active") {
  //     this.sidebar.nativeElement.classList.remove('active')
  //   } else {
  //     this.sidebar.nativeElement.classList.add('active')
  //   }
  // }

  // toggleNavbar() {
  //   if (this.navbar.nativeElement.className == "collapse navbar-collapse show") {
  //     this.navbar.nativeElement.classList.remove('show')
  //   } else {
  //     this.navbar.nativeElement.classList.add('show')
  //   }
  // }
}
