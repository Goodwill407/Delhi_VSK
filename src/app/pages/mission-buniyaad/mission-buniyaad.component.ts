import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommunicationService } from 'src/app/services/communication.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-mission-buniyaad',
  templateUrl: './mission-buniyaad.component.html',
  styleUrls: ['./mission-buniyaad.component.css']
})
export class MissionBuniyaadComponent {
  allSchoolData: any[] = [];
  communicationServiceMobile: any;
  SearchBox: any;

  constructor(private http: HttpServiceService, private spinner: NgxSpinnerService, private toastr: ToastrService, private communicationService: CommunicationService) {
    this.communicationServiceMobile = this.communicationService.isMobile;
  }

  ngOnInit() {

  }

  searchSchool() {
    this.spinner.show();
    if (this.SearchBox) {
      this.http.get('mission-buniyad/' + this.SearchBox).subscribe((res: any) => {
        if (res && res.length > 0) {
          res.sort((a: any, b: any) => a.class - b.class);
          this.allSchoolData = res;
        }
        else {
          this.toastr.warning('Data Not Found');
        }
        this.spinner.hide();
      },
        (err: any) => {
          this.toastr.error('Something Went Wrong');
          this.spinner.hide();
        });
    }

  }
}
