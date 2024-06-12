import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  user: any;
  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('userProfile')!);
  }
}
