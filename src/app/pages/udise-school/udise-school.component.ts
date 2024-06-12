import { Component, Input, SimpleChange, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommunicationService } from 'src/app/services/communication.service';
import { GraphService } from 'src/app/services/graph-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-udise-school',
  templateUrl: './udise-school.component.html',
  styleUrls: ['./udise-school.component.css']
})
export class UdiseSchoolComponent {
  TotalSchool: any
  allDistricts: any;
  districtModel: any = "";
  zoneModel: any = "";
  schoolModel: any = "";
  districtName: any;
  allSchools: any;
  allZones: any;
  TypeOfSchool: any
  allData: any
  searchBox: any;

  itemCount: number | undefined;
  subscription: Subscription | undefined;
  @ViewChild('openModal') openModal: any;

  // for Graph
  RuralUrbanCountsGraph: any
  SchoolGenderCountsGraph: any
  ShiftfSchoolCountsGraph: any
  TypeofSchoolCountsGraph: any
  SchoolTypeCountsGraph: any
  // for show school list
  SchoolType: any;
  allSchoolTypeData: any
  communicationServiceMobile: any;
  user: any;

  constructor(private httpService: HttpServiceService, private spinner: NgxSpinnerService, private route: ActivatedRoute, private graphService: GraphService, private toastr: ToastrService, private communicationService: CommunicationService) {
    this.subscription = this.communicationService.parentClick$.subscribe(() => {
      this.RuralUrbanCountsGraph = {}
      this.SchoolGenderCountsGraph = {}
      this.ShiftfSchoolCountsGraph = {}
      this.TypeofSchoolCountsGraph = {}
      this.getAllUdiseSchoolData();
    });
    this.user = JSON.parse(sessionStorage.getItem('userProfile')!);
    this.communicationServiceMobile = this.communicationService.isMobile;
  }

  ngOnInit() {
    this.communicationService.sharedData$.subscribe(data => {
      if (data == 'udise-school') {
        this.setRoleWiseDropdowns();
        if (this.user.role == 'admin') {
          this.getAllDistricts();
          this.getAllZones();
          this.getAllUdiseSchoolData();
        }
        this.subscription = this.graphService
          .getItemCountObservable()
          .subscribe((count) => {
            this.itemCount = count;
            if (this.itemCount && (this.SchoolType == this.SchoolType || this.SchoolType == 0) && !this.districtModel && !this.zoneModel) {
              this.getTypeWiseSchoolName(false);
            }
            else if (this.itemCount && this.districtModel && !this.zoneModel) {
              this.getTypeWiseSchoolNameOfDistrict(false);
            }
            else if (this.itemCount && this.zoneModel || this.districtModel) {
              this.getTypeWiseSchoolNameOfZone(false);
            }
          });
      }
    });
  }

  setRoleWiseDropdowns() {
    if (this.user.role == 'district') {
      const inputString = this.user.assignedTO;
      let regex = /([^-]+)-[0-9]+/;
      let match = inputString.match(regex);
      let valueBeforeHyphen = match ? match[1] : null;
      this.districtModel = valueBeforeHyphen;
      this.getGraphsByDistrictName();
    } else if (this.user.role == 'zone') {
      const text = this.user.assignedTO;
      const match = text.match(/(?<=-)(0*)([1-9]\d*)/);
      if (match) {
        this.zoneModel = match[2];
      }
      this.getGraphsByZone();
    }
  }

  getAllDistricts() {
    this.httpService.get('udise-school/district').subscribe((data: any) => {
      if (data && data.length > 0) {
        this.allDistricts = data;
      }
    })
  }


  getSchoolDataByDistrict() {
    const district = {
      District_name: this.districtModel
    }
    this.httpService.post('school/getDistrictSchool', district).subscribe((data: any) => {
      if (data && data.districtSchools) {
        this.allSchools = data.districtSchools;
      } else {
        this.allSchools = [];
      }
    });
  }

  getSchoolDataByZone() {
    const zone = {
      Zone_Name: this.zoneModel
    }
    this.httpService.post('school/getZoneSchool', zone).subscribe((data: any) => {
      if (data && data.ZoneSchool) {
        this.allSchools = data.ZoneSchool;
      } else {
        this.allSchools = [];
      }
    });
  }

  getGraphsByDistrictName() {
    this.spinner.show();
    if (this.districtModel) {
      const district = {
        district: this.districtModel
      }
      this.httpService.post('udise-school/udise-school-stats-by/district', district).subscribe((data: any) => {
        if (data) {
          this.setUdiseSchoolGraphs(data)
          this.getAllZones();
          // this.getAllSchools()
          this.spinner.hide();
        }
      }, (error) => {
        this.toastr.error('', 'Something went wrong !');
      })
    } else {
    }
    this.zoneModel = "";
    this.schoolModel = "";
  }

  getGraphsByZone() {
    this.spinner.show();
    const zone = {
      zone: Number(this.zoneModel)
    }
    this.httpService.post('udise-school/udise-school-stats-by/zone', zone).subscribe((data: any) => {
      if (data) {
        this.setUdiseSchoolGraphs(data)
        // this.getAllSchools()
        this.spinner.hide();
      }
    }, (error) => {
      this.toastr.error('', 'Something went wrong !');
    })
  }

  // getGraphsBySchoolName(){
  //   this.spinner.show();
  //   const school = {
  //     SchoolID:this.schoolModel.SchoolID
  //   }
  //   this.httpService.post('udise-school/udise-school-stats-by/school', school).subscribe((data: any) => {
  //     if (data) {
  //       this.setUdiseSchoolGraphs(data)
  //       this.spinner.hide();
  //     }
  //   }, (error) => {
  //     this.toastr.error('', 'Something went wrong !');
  //   })

  // }

  getAllZones() {
    if (this.districtModel) {
      const district = { "districtName": this.districtModel };
      this.httpService.post('udise-school/district-zones', district).subscribe((res: any) => {
        this.allZones = res;
      })
    } else {
      this.httpService.get('udise-school/zone').subscribe((res: any) => {
        this.allZones = res.ZoneInfo;
      })
    }
  }

  // getAllSchools() {
  //   if (this.districtModel && !this.zoneModel) {
  //     const district = {
  //       district: this.districtModel
  //     }
  //     this.httpService.post('udise-school/district-wise/schools', district).subscribe((data: any) => {
  //       if (data) {
  //         this.allSchools = data
  //       } else {
  //         this.allSchools = [];
  //       }
  //     });
  //   } else if (this.zoneModel) {
  //     const zone = {
  //       zone: Number(this.zoneModel)
  //     }
  //     this.httpService.post('udise-school/zone-wise/school', zone).subscribe((data: any) => {
  //       if (data) {
  //         this.allSchools = data
  //       } else {
  //         this.allSchools = [];
  //       }
  //     });
  //   }
  // }

  getAllUdiseSchoolData() {
    this.spinner.show();
    this.httpService.get('udise-school/udise-school-stats').subscribe((data: any) => {
      if (data) {
        this.setUdiseSchoolGraphs(data)
        this.spinner.hide();
      }
    })
  }

  setUdiseSchoolGraphs(data: any) {
    this.allData = data
    this.TotalSchool = data.totalSchoolCount
    const RuralUrbanCounts = data.ruralUrbanCounts
    const School_GenderCounts = data.schoolGenderCounts
    const ShiftfSchoolCounts = data.shiftofschoolCounts
    // const TypeofschoolCounts = data.typeofschoolCounts
    const SchoolTypeCountsGraph = data.schoolTypeCounts

    this.getRuralUrbanCountsGraph(RuralUrbanCounts)
    this.getSchoolGenderCounts(School_GenderCounts)
    this.getShiftWiseCountGraph(ShiftfSchoolCounts)
    // this.getTypeofSchoolCountsGraph(TypeofschoolCounts)
    this.getSchoolTypeCountsGraph(SchoolTypeCountsGraph)

  }

  getRuralUrbanCountsGraph(RuralUrbanCounts: any) {
    const RuralOrUrban = RuralUrbanCounts.map((item: any) => item._id)
    const RuralOrUrbanCount = RuralUrbanCounts.map((item: any) => item.count)
    this.RuralUrbanCountsGraph = this.graphService.PieGraph('donut', '');
    const series = RuralOrUrbanCount;
    const labels = RuralOrUrban
    this.RuralUrbanCountsGraph.series = [...series];
    this.RuralUrbanCountsGraph.labels = [...labels]
  }

  getSchoolGenderCounts(School_GenderCounts: any) {
    const GenderType = School_GenderCounts.map((item: any) => item._id)
    const GenderWiseCount = School_GenderCounts.map((item: any) => item.count)
    this.SchoolGenderCountsGraph = this.graphService.PieGraph('donut', '');
    const series = GenderWiseCount;
    const labels = GenderType
    this.SchoolGenderCountsGraph.series = [...series];
    this.SchoolGenderCountsGraph.labels = [...labels]

  }

  getShiftWiseCountGraph(Shift_ofSchoolCounts: any) {
    const TypeOfShift = Shift_ofSchoolCounts.map((item: any) => item._id)
    const ShiftWiseCount = Shift_ofSchoolCounts.map((item: any) => item.count)
    this.ShiftfSchoolCountsGraph = this.graphService.PieGraph('donut','');
    const series = ShiftWiseCount;
    const labels = TypeOfShift
    this.ShiftfSchoolCountsGraph.series = [...series];
    this.ShiftfSchoolCountsGraph.labels = [...labels]

  }

  // getTypeofSchoolCountsGraph(Type_Of_School_count: any) {
  //   const TypeOfSchool = Type_Of_School_count.map((item: any) => item._id)
  //   const TypeOfschoolCount = Type_Of_School_count.map((item: any) => item.count)
  //   this.TypeofSchoolCountsGraph = this.graphService.PieGraph('donut', '');
  //   const series = TypeOfschoolCount;
  //   const labels = TypeOfSchool
  //   this.TypeofSchoolCountsGraph.series = [...series];
  //   this.TypeofSchoolCountsGraph.labels = [...labels]

  // }

  getSchoolTypeCountsGraph(SchoolTypeCounts: any) {
    this.TypeOfSchool = SchoolTypeCounts.map((item: any) => item._id)
    const TypeOfschoolCount = SchoolTypeCounts.map((item: any) => item.count)
    const seres: any = [{
      name: "School",
      data: [...TypeOfschoolCount]
    }];
    this.SchoolTypeCountsGraph = this.graphService.VerticleBarGraph();
    const series = seres;
    const labels = this.TypeOfSchool
    this.SchoolTypeCountsGraph.plotOptions.bar.horizontal = false;
    this.SchoolTypeCountsGraph.xaxis.categories = [...labels]
    this.SchoolTypeCountsGraph.series = [...series];
    this.SchoolTypeCountsGraph.chart.events = {
      dataPointSelection: (event: any, chartContext: any, config: any) => {
        this.UdiseSchoolDataClear();
        this.SchoolType = config.dataPointIndex;
        this.graphService.addToCart();
      }
    }
  }

  // get data for showing udise school list

  UdiseSchoolDataClear() {
    this.SchoolType = null;
    this.allSchoolTypeData = []
  }

  getTypeWiseSchoolName(flash: any) {
    if (!flash) {
      this.spinner.show();
      const parameter = {
        "schoolType": this.allData.schoolTypeCounts[this.SchoolType]._id
      }
      this.httpService.post('udise-school/school/school-type-wise', parameter).subscribe((res: any) => {
        this.allSchoolTypeData = res;
        if (!flash) {
          this.openModal.nativeElement.click();
        }
        this.spinner.hide();
      })
    }
  }

  getTypeWiseSchoolNameOfDistrict(flash: any) {
    if (!flash) {
      this.spinner.show();
      const parameter = {
        "schoolType": this.allData.schoolTypeCounts[this.SchoolType]._id,
        "district": this.districtModel
      }

      this.httpService.post('/udise-school/school/school-type-wise/district', parameter).subscribe((res: any) => {
        this.allSchoolTypeData = res;
        if (!flash) {
          this.openModal.nativeElement.click();
        }
        this.spinner.hide();
      })
    }
  }

  getTypeWiseSchoolNameOfZone(flash: any) {
    if (!flash) {
      this.spinner.show();
      const parameter = {
        "schoolType": this.allData.schoolTypeCounts[this.SchoolType]._id,
        "zone": Number(this.zoneModel)
      }
      this.httpService.post('udise-school/school/school-type-wise/zone', parameter).subscribe((res: any) => {
        this.allSchoolTypeData = res;
        if (!flash) {
          this.openModal.nativeElement.click();
        }
        this.spinner.hide();
      })
    }
  }

  exportToCSV(): void {
    this.communicationService.exportToCSV(this.allSchoolTypeData, 'schoolType_data');
  }

  exportToExcel(): void {
    this.communicationService.exportToExcel(this.allSchoolTypeData, 'schoolType_data', 'Sheet1');
  }

}


