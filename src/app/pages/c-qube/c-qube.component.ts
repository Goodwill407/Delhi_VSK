import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-c-qube',
  templateUrl: './c-qube.component.html',
  styleUrls: ['./c-qube.component.css']
})
export class CQubeComponent {

  constructor(private router:ActivatedRoute){}
  tabName:any;
  ngOnInit(){
    this.router.queryParams.subscribe((param)=>{
      this.tabName = param['tabName'];
    })
  }
}
