import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription, forkJoin } from 'rxjs';
import { CommunicationService } from 'src/app/services/communication.service';
import { GraphService } from 'src/app/services/graph-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-udise-home',
  templateUrl: './udise-home.component.html',
  styleUrls: ['./udise-home.component.css']
})
export class UdiseHomeComponent {

  allDistricts: any;
  districtModel: any = "";
  zoneModel: any = "";
  schoolModel: any = "";
  districtName: any;
  allSchools: any;
  allZones: any;
  searchBox: any;
  studentOrientation: any;
  studentTraining: any;
  sportAndGames: any;
  freeUniform: any;
  freeBook: any;
  totalSchoolsData: any;
  communicationServiceMobile: any;

  itemCount: number | undefined;
  subscription: Subscription | undefined;

  constructor(private httpService: HttpServiceService, private spinner: NgxSpinnerService, private route: ActivatedRoute, private graphService: GraphService, private toastr: ToastrService, private communicationService: CommunicationService, private cdr:ChangeDetectorRef) {
    this.communicationServiceMobile = this.communicationService.isMobile;
  }

  ngOnInit() {
    this.communicationService.sharedData$.subscribe(data => {
      if (data == 'home') {
        this.getAllData();
        this.getAllDistricts();
        this.getAllZones();
        this.getAllSchoolName();
        this.subscription = this.graphService
        .getItemCountObservable()
        .subscribe((count) => {
          this.itemCount = count;
          if (this.itemCount && (this.schoolModel || this.zoneModel) && this.dataPointIndex == this.dataPointIndex || 0) {
            this.openModalData();
          } 
        });
      }
    });
  }


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

  getGraphsByDistrictName() {
    if (this.districtModel) {
      this.spinner.show();
      const api1 = this.httpService.get('student-orientation/get-student-orientation?district=' + this.districtModel);
      const api2 = this.httpService.get('student-training/get-student-training?district=' + this.districtModel);
      const api3 = this.httpService.get('equipment/get-sports-games-equipment?district=' + this.districtModel);
      const api4 = this.httpService.get('free-uniform/get-free-uniform?district=' + this.districtModel);
      const api5 = this.httpService.get('free-textbook/get-free-textbook?district=' + this.districtModel);

      forkJoin([api1, api2, api3, api4, api5]).subscribe(([res1, res2, res3, res4, res5]) => {
        if (res1) {
          this.studentOrientationGraph(res1);
          this.studentTrainingGraph(res2);
          this.sportsAndGamesEquipment(res3);
          this.freeUniformGraph(res4);
          this.freeBookGraph(res5);
          this.barGraphOfData([res1, res2, res3, res4, res5], ['cyber safety', 'training received', 'sport and games', 'free uniform', 'free Book'])
          this.getAllZones();
          this.getAllSchoolsByDistrict();
          this.zoneModel = '';
          this.schoolModel = '';
          this.spinner.hide();
        }
      }, (error) => {
        this.spinner.hide();
        this.toastr.error('', 'Something went wrong !');
      });
    } else {
      // this.getAllTeacherData();
      this.getAllZones();
      this.allSchools = [];
      this.zoneModel = '';
      this.schoolModel = '';
    }
  }

  getGraphsByZone() {
    if (this.zoneModel) {
      this.spinner.show()
      const zone = Number(this.zoneModel.slice(-2));
      const api1 = this.httpService.get('student-orientation/get-student-orientation?zone=' + zone);
      const api2 = this.httpService.get('student-training/get-student-training?zone=' + zone);
      const api3 = this.httpService.get('equipment/get-sports-games-equipment?zone=' + zone);
      const api4 = this.httpService.get('free-uniform/get-free-uniform?zone=' + zone);
      const api5 = this.httpService.get('free-textbook/get-free-textbook?zone=' + zone);

      forkJoin([api1, api2, api3, api4, api5]).subscribe(([res1, res2, res3, res4, res5]) => {
        if (res1) {
          this.studentOrientationGraph(res1);
          this.studentTrainingGraph(res2);
          this.sportsAndGamesEquipment(res3);
          this.freeUniformGraph(res4);
          this.freeBookGraph(res5);
          this.barGraphOfData([res1, res2, res3, res4, res5], ['cyber safety', 'training received', 'sport and games', 'free uniform', 'free Book'])
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

  getGraphsBySchoolName() {
    this.spinner.show();
    const api1 = this.httpService.get('student-orientation/get-student-orientation?SchoolID=' + this.schoolModel.Schoolid);
    const api2 = this.httpService.get('student-training/get-student-training?SchoolID=' + this.schoolModel.Schoolid);
    const api3 = this.httpService.get('equipment/get-sports-games-equipment?SchoolID=' + this.schoolModel.Schoolid);
    const api4 = this.httpService.get('free-uniform/get-free-uniform?SchoolID=' + this.schoolModel.Schoolid);
    const api5 = this.httpService.get('free-textbook/get-free-textbook?SchoolID=' + this.schoolModel.Schoolid);

    forkJoin([api1, api2, api3, api4, api5]).subscribe(([res1, res2, res3, res4, res5]) => {
      if (res1) {
        this.studentOrientationGraph(res1);
        this.studentTrainingGraph(res2);
        this.sportsAndGamesEquipment(res3);
        this.freeUniformGraph(res4);
        this.freeBookGraph(res5);
        this.barGraphOfData([res1, res2, res3, res4, res5], ['cyber safety', 'training received', 'sport and games', 'free uniform', 'free Book'])
        this.spinner.hide();
      }
    }, (error) => {
      this.spinner.hide();
      this.toastr.error('', 'Something went wrong !');
    })
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
  getAllSchoolName() {
    this.httpService.get('school/get-all-school-name').subscribe((res: any) => {
      if (res) {
        this.allSchools = res;
      } else {
        this.allSchools = [];
      }
    })
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

  getAllSchoolsByDistrict() {
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

  getAllData() {
    this.spinner.show();
    const api1 = this.httpService.get('student-orientation/path-to-get-all-data?page=1');
    const api2 = this.httpService.get('student-training/path-to-get-all-data?page=1');
    const api3 = this.httpService.get('equipment/path-to-get-all-data?page=1');
    const api4 = this.httpService.get('free-uniform/path-to-get-all-data?page=1');
    const api5 = this.httpService.get('free-textbook/path-to-get-all-data?page=1');

    forkJoin([api1, api2, api3, api4, api5]).subscribe(([res1, res2, res3, res4, res5]) => {
      if (res1) {
        this.studentOrientationGraph(res1.results);
        this.studentTrainingGraph(res2.results);
        this.sportsAndGamesEquipment(res3.results);
        this.freeUniformGraph(res4.results);
        this.freeBookGraph(res5.results);
        this.barGraphOfData([res1.results, res2.results, res3.results, res4.results, res5.results], ['cyber safety', 'training received', 'sport and games', 'free uniform', 'free Book'])
      }
      else {
        this.toastr.warning('Data Not Found');
      }
      this.spinner.hide();
    })
  }

  setAllGraphs(data: any) {
    this.studentOrientationGraph(data);
  }

  // --------Graphs------------//
  studentOrientationGraph(data: any) {
    this.studentOrientation = this.graphService.PieGraph('donut', 'School');
    const series = data.length;
    const labels = 'Cyber Safety'
    this.studentOrientation.series.push(series);
    this.studentOrientation.labels.push(labels);
  }

  studentTrainingGraph(data: any) {
    this.studentTraining = this.graphService.PieGraph('donut', 'School');
    const series = data.length;
    const labels = 'Training School'
    this.studentTraining.series.push(series);
    this.studentTraining.labels.push(labels);
  }

  sportsAndGamesEquipment(data: any) {
    this.sportAndGames = this.graphService.PieGraph('donut', 'School');
    const series = data.length;
    const labels = 'Sport And Games'
    this.sportAndGames.series.push(series);
    this.sportAndGames.labels.push(labels);
  }

  freeUniformGraph(data: any) {
    this.freeUniform = this.graphService.PieGraph('donut', 'School');
    const series = data.length;
    const labels = 'Free Uniform'
    this.freeUniform.series.push(series);
    this.freeUniform.labels.push(labels);
  }

  freeBookGraph(data: any) {
    this.freeBook = this.graphService.PieGraph('donut', 'School');
    const series = data.length;
    const labels = 'Free Book'
    this.freeBook.series.push(series);
    this.freeBook.labels.push(labels);
    this.freeBook.chart.events = {
      dataPointSelection: (event: any, chartContext: any, config: any) => {
        console.log(config);
        
      }
    }
  }

  seriesData:any;
  dataPointIndex:any;
  @ViewChild('openModal') openModal: any;
  barGraphOfData(seriesData: any, categories: any) {
    const series = seriesData.map((item: any) => item.length)
    this.totalSchoolsData = this.graphService.VerticleBarGraph();
    this.totalSchoolsData.series = [{ name: "Count", data: series }];
    this.totalSchoolsData.xaxis.categories = [...categories];
    this.totalSchoolsData.plotOptions.bar.horizontal = false;
    this.totalSchoolsData.yaxis.title.text = "Count";
    this.totalSchoolsData.chart.events = {
      dataPointSelection: (event: any, chartContext: any, config: any) => {
        this.seriesData = []
        this.dataPointIndex = config.dataPointIndex;
        this.seriesData = seriesData[this.dataPointIndex];
        console.log(this.dataPointIndex,'data',this.seriesData);
        this.graphService.addToCart();
        this.cdr.detectChanges();
      }
      
    }
  }
  openModalData(){
    this.openModal.nativeElement.click();
  }

  exportToCSV(): void {
    this.communicationService.exportToCSV(this.seriesData, 'School Data');
  }
  exportToExcel(): void {
    this.communicationService.exportToExcel(this.seriesData, 'School Data', 'Sheet1');
  }
}
