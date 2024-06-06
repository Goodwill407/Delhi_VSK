import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommunicationService } from 'src/app/services/communication.service';
import { GraphService } from 'src/app/services/graph-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-teacher-guest',
  templateUrl: './teacher-guest.component.html',
  styleUrls: ['./teacher-guest.component.css']
})
export class TeacherGuestComponent {
  commonBarGraph: any;
  commonPieGraph: any;
  commonPollarChart: any;
  chartOptions1: any;
  commonTreeMap: any;

  teacherGenderRatio: any;
  studentsGenderRatio: any;
  schoolsManagementWiseTeacherGuest: any;
  schoolTypeWiseCount: any;
  experienceWiseTeacher: any;
  shiftWiseSchoolsGuest: any;
  averageTeacherOfSchool: any;
  allDistricts: any;
  allSchools: any;
  districtModel: any = "";
  schoolModel: any = "";
  zoneModel: any = "";
  allZones: any;
  user: any;
  districtName: any;
  schoolName: any;
  allTeacherData: any;
  designationGuest: any;
  teacherCategoryGuest: any;

  allData: any;
  @ViewChild('openModalGuest') openModalGuest: any;
  @ViewChild('tableElement') tableElement!: ElementRef;
  @Output() downloadSelected = new EventEmitter<string>();

  itemCount: number | undefined;
  subscription: Subscription;

  configGender: any;
  commonName: any;
  configDesignation: any;
  searchBox: any;
  globalSearchBox: any;
  communicationServiceMobile: any;
  teacherSearchData: any[] = [];
  profileDetails: any;
  searchLoader: boolean = false;
  downloadPopOpen: boolean = false;


  constructor(private httpService: HttpServiceService, private spinner: NgxSpinnerService, private graphService: GraphService, private toastr: ToastrService, private communicationService: CommunicationService) {
    this.communicationServiceMobile = this.communicationService.isMobile;
    this.subscription = this.communicationService.parentClick$.subscribe(() => {
      this.getAllGuestTeacherData();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.communicationService.sharedData$.subscribe(data => {
      if (data == 'guest') {
        this.user = JSON.parse(sessionStorage.getItem('userProfile')!);
        if (this.user.role == 'admin') {
          this.getAllGuestTeacherData();
          this.getAllDistricts();
          this.getAllZones();
          this.getAllSchoolName();
        }else if(this.user.role == 'district'){
          this.districtModel = this.user.assignedTO;
          this.getGraphsByDistrictName();
          this.getAllZones();
          this.getAllSchoolName();          
        }else if(this.user.role == 'zone'){
          this.zoneModel = this.user.assignedTO;
          this.getGraphsByZone();
          this.getAllSchoolName();
        }

        this.subscription = this.graphService
          .getItemCountObservable()
          .subscribe((count) => {
            this.itemCount = count;
            if (this.itemCount && this.schoolModel && this.configDesignation == this.configDesignation || 0) {
              this.getTeachersByDesignation(false);
            }
          });
      }
      else {
        this.districtModel = "";
        this.schoolModel = "";
        this.zoneModel = "";
      }
    });
  }

  // Emitted Data
  selectedDistrictEmit(event: any) {
    this.districtModel = event;
    this.getGraphsByDistrictName();
  }

  selectedZoneEmit(event: any) {
    this.zoneModel = event;
    this.getGraphsByZone();
  }

  selectedSchoolEmit(event: any) {
    this.schoolModel = event;
    this.getGraphsBySchoolName();
  }
  // Emitted Data

  getAllDistricts() {
    this.httpService.get('school/districtNames').subscribe((data: any) => {
      if (data && data.length > 0) {
        this.allDistricts = data;
        this.allDistricts = this.allDistricts.sort((a: any, b: any) => a.D_ID - b.D_ID);
      }
    }, (error) => {
      this.toastr.error('', 'Something went wrong !');
    })
  }

  getAllSchoolName() {
    this.httpService.get('school/get-all-school-name').subscribe((res: any) => {
      if (res) {
        this.allSchools = res;
      } else {
        this.allSchools = [];
      }
    })
  }

  getAllGuestTeacherData() {
    this.spinner.show();
    this.httpService.get('guest-teacher/school-wise').subscribe((data: any) => {
      if (data) {
        this.setAllGraphs(data);
        this.spinner.hide();
      }
    }, (error) => {
      this.spinner.hide();
      this.toastr.error('', 'Something went wrong !');
    })
  }

  setAllGraphs(data: any) {
    this.allData = data;
    // this.getTeachersGenderRatio(teachersGender);
    this.getschoolsManagementWiseTeacher(data.teacherManagmentWiseCounts);
    this.getShiftWiseSchools(data.teacherShiftWiseCounts);
    let newData = data.teacherCounts.sort((a: any, b: any) => a.teacherCount - b.teacherCount);
    this.getCategoryWiseTeacher(newData);
    this.getDesignation(data.postdescWiseTeacherCounts);
    // this.getExperianceOfTeachers(data.experianceOfTeachers);
    this.getSchoolTypeWiseCount(data.teacherTypeOfSchoolWiseCounts);
    // this.getStreamWiseCount(data.teacherStreamWiseCounts);
    // this.getMinorityWiseCount(data.teacherMinorityWiseCounts);
  }

  getGraphsByDistrictName() {
    if (this.districtModel) {
      const district = {
        DistrictName: this.districtModel
      }
      this.spinner.show();
      this.httpService.post('guest-teacher/school-district-wise', district).subscribe((data: any) => {
        if (data) {
          this.setAllGraphs(data);
          this.getAllZones();
          this.getAllSchools();
          this.zoneModel = '';
          this.schoolModel = '';
          this.spinner.hide();
        }
      }, (error) => {
        this.spinner.hide();
        this.toastr.error('', 'Something went wrong !');
      })
    } else {
      this.getAllGuestTeacherData();
      this.getAllZones();
      this.allSchools = [];
      this.zoneModel = '';
      this.schoolModel = '';
    }

  }

  getAllZones() {
    if (this.districtModel) {
      const district = { "District_name": this.districtModel };
      this.httpService.post('school/getDistrictZone', district).subscribe((res: any) => {
        this.allZones = res.ZoneSchool;
      }, (error) => {
        this.toastr.error('', 'Something went wrong !');
      })
    } else {
      this.httpService.get('school/zonename').subscribe((res: any) => {
        this.allZones = res.ZoneInfo;
        this.allZones = this.allZones.sort((a: any, b: any) => a.Z_ID - b.Z_ID);
      }, (error) => {
        this.toastr.error('', 'Something went wrong !');
      })
    }
  }

  getGraphsByZone() {
    if (this.zoneModel) {
      this.spinner.show();
      const zone = {
        zoneName: this.zoneModel
      }
      this.httpService.post('guest-teacher/school/zone-wise', zone).subscribe((data: any) => {
        if (data) {
          this.setAllGraphs(data);
          this.spinner.hide();
          this.getSchoolDataByZone();
        }
      }, (error) => {
        this.spinner.hide();
        this.toastr.error('', 'Something went wrong !');
      })
    } else {
      this.getGraphsByDistrictName();
    }
  }

  getSchoolDataByZone() {
    const zone = {
      Zone_Name: this.zoneModel
    }
    this.spinner.show();
    this.httpService.post('school/getZoneSchool', zone).subscribe((data: any) => {
      if (data && data.ZoneSchool) {
        this.allSchools = data.ZoneSchool;
        this.allSchools = this.allSchools.sort((a: any, b: any) => a.Schoolid - b.Schoolid);
        this.schoolModel = ''
        this.spinner.hide();
      } else {
        this.allSchools = [];
        this.spinner.hide();
      }
    }, (error) => {
      this.spinner.hide();
      this.toastr.error('', 'Something went wrong !');
    });
  }

  getAllSchools() {
    const district = {
      District_name: this.districtModel
    }
    this.spinner.show();
    this.httpService.post('school/getDistrictSchool', district).subscribe((data: any) => {
      if (data && data.districtSchools) {
        this.allSchools = data.districtSchools;
        this.allSchools = this.allSchools.sort((a: any, b: any) => a.Schoolid - b.Schoolid);
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.allSchools = [];
      }
    }, (error) => {
      this.spinner.hide();
      this.toastr.error('', 'Something went wrong !');
    })
  }

  getGraphsBySchoolName() {
    const school = {
      Schoolid: String(this.schoolModel.Schoolid)
    }
    this.spinner.show();
    this.httpService.post('guest-teacher/school-wise/stats', school).subscribe((data: any) => {
      if (data) {
        this.setAllGraphs(data);
        this.spinner.hide();
      }
    }, (error) => {
      this.spinner.hide();
      this.toastr.error('', 'Something went wrong !');
    })
  }

  teacherDataClear() {
    this.configDesignation = null;
    this.configGender = null;
    this.commonName = null;
    this.allTeacherData = [];
  }

  getShiftWiseSchools(shiftWiseCount: any) {
    let Morning = 0; let Afternoon = 0; let Evening = 0; let General = 0;
    for (let i = 0; i < shiftWiseCount.length; i++) {
      if (shiftWiseCount[i].shift == "General") {
        General = shiftWiseCount[i].teacherShiftWiseCount;
      }
      if (shiftWiseCount[i].shift == "Morning") {
        Morning = shiftWiseCount[i].teacherShiftWiseCount;
      }
      if (shiftWiseCount[i].shift == "Afternoon") {
        Afternoon = shiftWiseCount[i].teacherShiftWiseCount;
      }
      if (shiftWiseCount[i].shift == "Evening") {
        Evening = shiftWiseCount[i].teacherShiftWiseCount;
      }
    }
    const series = [Morning, Afternoon, Evening, General]
    this.shiftWiseSchoolsGuest = this.graphService.PolarGraph('Shift Teachers');
    this.shiftWiseSchoolsGuest.series = [...series];
    this.shiftWiseSchoolsGuest.labels = ['Morning', 'Afternoon', 'Evening', 'General'];
    this.shiftWiseSchoolsGuest.chart.events = {
      dataPointSelection: (event: any, chartContext: any, config: any) => {
        this.teacherDataClear();
        this.getTachersBySchoolName();
        this.commonName = `Shift : ( ${shiftWiseCount[0].shift} )`;
      }
    }
  }


  getschoolsManagementWiseTeacher(schoolManagementWise: any) {
    this.schoolsManagementWiseTeacherGuest = this.graphService.PieGraph('donut', 'Teachers')
    for (let i = 0; i < schoolManagementWise.length; i++) {
      if (schoolManagementWise[i].shift == "Government") { var govCount = schoolManagementWise[i].teacherManagmentWiseCount }
      if (schoolManagementWise[i].shift == "Aided") { var aidedCount = schoolManagementWise[i].teacherManagmentWiseCount }
    }
    this.schoolsManagementWiseTeacherGuest.series = [govCount ? govCount : 0, aidedCount ? aidedCount : 0];
    this.schoolsManagementWiseTeacherGuest.labels = ['Government', 'Aided'];
    this.schoolsManagementWiseTeacherGuest.chart.events = {
      dataPointSelection: (event: any, chartContext: any, config: any) => {
        this.teacherDataClear();
        this.getTachersBySchoolName();
        this.commonName = `Management : ( ${govCount > 0 ? 'Government' : 'Aided'} )`;
      }
    }

  }

  getCategoryWiseTeacher(data: any) {
    this.teacherCategoryGuest = this.graphService.VerticleBarGraph();;
    const series: any = [{
      name: "Teachers",
      data: []
    }];
    for (let i = 0; i < data.length; i++) {
      series[0].data.push(data[i].teacherCount);
      this.teacherCategoryGuest.xaxis.categories.push(data[i].SchCategory);
    }
    this.teacherCategoryGuest.xaxis.labels = {
      rotate: -45, // Adjust the rotation angle as needed
      style: {
        fontSize: '9px'
      }
    }
    this.teacherCategoryGuest.series = [...series];
    this.teacherCategoryGuest.chart.events = {
      dataPointSelection: (event: any, chartContext: any, config: any) => {
        this.teacherDataClear();
        this.getTachersBySchoolName();
        this.commonName = `Category : ( ${data[0].SchCategory} )`;
      }
    }

  }

  getExperianceOfTeachers(data: any) {
    this.experienceWiseTeacher = this.graphService.VerticleBarGraph();
    const series: any = [{
      name: "Teachers",
      data: []
    }];
    series[0].data = [data.under5Years, data.fiveTo10Years, data.tenTo15Years, data.fifteenTo20Years, data.twentyTo25Years, data.over25Years];
    this.experienceWiseTeacher.series = [...series]
    this.experienceWiseTeacher.colors = ["#F44F5E"];
    this.experienceWiseTeacher.xaxis.categories = ['0-5 Years', '5-10 Years', '10-15 Years', '15-20 Years', '20-25 Years', '25 + Years'];

  }

  getDesignation(post: any) {
    this.designationGuest = this.graphService.VerticleBarGraph();
    const series: any = [{
      name: ["Teachers"],
      data: []
    }];
    for (let i = 0; i < post.length; i++) {
      series[0].data.push(post[i].teacherCount);
      this.designationGuest.xaxis.categories.push(post[i]._id);
    }
    this.designationGuest.series = [...series];
    // this.designationGuest.plotOptions.bar.horizontal = false;
    this.designationGuest.xaxis.title.text = "Designation";
    this.designationGuest.yaxis.title.text = "Teachers";
    // this.designationGuest.dataLabels.enabled = false;
    this.designationGuest.plotOptions.bar.dataLabels = {
      position: 'start', // Set data label position to start
    }
    this.designationGuest.chart.height = "660px"
    this.designationGuest.chart.events = {
      dataPointSelection: (event: any, chartContext: any, config: any) => {
        this.teacherDataClear();
        this.configDesignation = config.dataPointIndex;
        this.graphService.addToCart();
      }
    }
  }

  getTeachersByDesignation(flash: any) {
    if (this.configDesignation) {
      const parameter = {
        "SchoolID": String(this.schoolModel.Schoolid),
        "Post": this.allData.postdescWiseTeacherCounts[this.configDesignation]._id
      }
      this.httpService.post('guest-teacher/school/post-wise/teacher-list', parameter).subscribe((res: any) => {
        this.allTeacherData = res;
        if (!flash) {
          this.openModalGuest.nativeElement.click();
        }
      })
    }
  }

  getTachersBySchoolName() {
    if (this.schoolModel) {
      const parameter = {
        "SchoolID": String(this.schoolModel.Schoolid)
      };
      this.teacherDataClear();
      this.httpService.post('guest-teacher/school/teacher-list', parameter).subscribe((res: any) => {
        this.allTeacherData = res;
        if (this.schoolModel) {
          this.openModalGuest.nativeElement.click();
        }
      });
    }
  }

  getSchoolTypeWiseCount(data: any) {
    data = data.filter((item: any) => item.typeOfSchool !== null && item.typeOfSchool.trim() !== "");
    this.schoolTypeWiseCount = this.graphService.PolarGraph('School Teachers');
    for (let i = 0; i < data.length; i++) {
      this.schoolTypeWiseCount.series.push(data[i].teacherTypeOfSchoolWiseCount);
      this.schoolTypeWiseCount.labels.push(data[i].typeOfSchool);
    };
    this.schoolTypeWiseCount.chart.events = {
      dataPointSelection: (event: any, chartContext: any, config: any) => {
        this.teacherDataClear();
        this.getTachersBySchoolName();
        this.commonName = `School Type : ( ${data[0].typeOfSchool} School )`;
      }
    }
  }

  searchTeacher() {
    this.teacherSearchData = [];
    if (this.globalSearchBox) {
      this.searchLoader = true;
      this.httpService.post('guest-teacher/search-guest-teachers', { searchQuery: this.globalSearchBox }).subscribe((res: any) => {
        if (res) {
          this.teacherSearchData = res;
        }
        this.searchLoader = false;
      })
    }
  }

  search() {
    if (this.globalSearchBox) {
      this.searchTeacher()
    } else {
      this.teacherSearchData = [];
    }
  }

  viewProfileDetails(data: any) {
    if (data) {
      this.profileDetails = data;
    }
  }

  exportToCSV(): void {
    this.communicationService.exportToCSV(this.allTeacherData, 'guest teacher Data');
  }

  public async captureScreen() {
    const data: any = document.getElementById('contentToConvert');
    this.communicationService.exportToPDF(data);
  }

  exportToExcel(): void {
    this.communicationService.exportToExcel(this.allTeacherData, 'guest teacher Data', 'Sheet1');
  }

}
