// role-wise-dropdown.component.ts
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
  @Input() showOptionalDropdown: boolean = false;
  @Input() optionalData: any[] = [];

  @Output() selectedDistrict = new EventEmitter<string>();
  @Output() selectedZone = new EventEmitter<string>();
  @Output() selectedSchool = new EventEmitter<any>();
  @Output() managementType = new EventEmitter<any>();

  districtModel: any = "";
  zoneModel: any = "";
  schoolModel: any = "";
  managementModel: any = "";

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
      this.districtModel = this.user.assignedTO;
      this.selectedDistrict.emit(this.districtModel);
    } else if (this.user.role == 'zone') {
      this.zoneModel = this.user.assignedTO;
      this.selectedZone.emit(this.zoneModel);
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

  getOptionalData() {
    this.managementType.emit(this.managementModel);
  }
}
