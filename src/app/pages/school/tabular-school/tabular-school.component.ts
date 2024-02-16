import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommunicationService } from 'src/app/services/communication.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-tabular-school',
  templateUrl: './tabular-school.component.html',
  styleUrls: ['./tabular-school.component.css']
})
export class TabularSchoolComponent {
  allSchoolData: any[] = [];
  communicationServiceMobile: any;
  maxDate: any = '2024-08-28';
  SearchBox: any;

  constructor(private http: HttpServiceService, public datepipe: DatePipe, private spinner: NgxSpinnerService, private toastr: ToastrService, private communicationService: CommunicationService) {
    this.communicationServiceMobile = this.communicationService.isMobile;
  }

  ngOnInit() {
   
  }

  searchSchool() {
    this.spinner.show();
    if (this.SearchBox) {
      this.http.get('mission-buniyad/'+this.SearchBox).subscribe((res:any)=>{
        if(res && res.length > 0){
          this.allSchoolData = res;
        }
        else{
          this.toastr.warning('Data Not Found');
        }
        this.spinner.hide();
      },
      (err:any)=>{
        this.toastr.error('Something Went Wrong');
        this.spinner.hide();
      });
    }
   
  }
}

