import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'app-role-wise-dropdown',
  templateUrl: './role-wise-dropdown.component.html',
  styleUrls: ['./role-wise-dropdown.component.css']
})
export class RoleWiseDropdownComponent {
  @Input() allDistricts: any;
  @Input() allZones: any;
  @Input() allSchools: any;

  @Output() selectedDistrict = new EventEmitter<string>();
  @Output() selectedZone = new EventEmitter<string>();
  @Output() selectedSchool = new EventEmitter<any>();

  districtModel: any = "";
  zoneModel: any = "";
  schoolModel: any = "";

  communicationServiceMobile: any;
  user: any;

  constructor(private communicationService: CommunicationService) {
    this.communicationServiceMobile = this.communicationService.isMobile;
    this.user = JSON.parse(sessionStorage.getItem('userProfile')!);
  }

  ngOnInit() {
    this.setRoleWiseDropdowns();
  }

  setRoleWiseDropdowns() {
    if (this.user.role == 'district') {
      const inputString = this.user.assignedTO;

      let regex = /([^-]+)-[0-9]+/;
      let match = inputString.match(regex);
      let valueBeforeHyphen = match ? match[1] : null;
      
      this.districtModel = valueBeforeHyphen;
      this.selectedDistrict.emit(this.districtModel);
    }
  }

  getGraphsByDistrictName() {
    this.selectedDistrict.emit(this.districtModel);
  }

  getGraphsByZone() {
    this.selectedZone.emit(this.zoneModel);
  }

  getGraphsBySchoolName() {
    this.selectedSchool.emit(this.schoolModel);
  }
}
