import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GraphService } from 'src/app/services/graph-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-pgi',
  templateUrl: './pgi.component.html',
  styleUrls: ['./pgi.component.css']
})
export class PgiComponent {

  allGraphData: any;

  //Graph
  outcomeGraph: any;
  classroomTransaction: any;
  schoolSafetyAndChildProtection: any;
  digitalLearning: any;
  governanceProcesses: any;

  constructor(private httpService: HttpServiceService, private spinner: NgxSpinnerService, private route: ActivatedRoute, private graphService: GraphService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.getAllGraphData();
  }

  getAllGraphData() {
    this.httpService.get('alldashboard2/pgi-alldashboard?limit=10&page=1').subscribe((data: any) => {
      if (data && data.results.length > 0) {
        this.allGraphData = data.results;
        this.setGraphData();
      }
    });
  }

  setGraphData() {
    let districtsLabel = [];

    let outcomeCount = [];
    let classroomTransactionCount = [];
    let schoolSafetyAndChildProtection = [];
    let digitalLearning = [];
    let governanceProcesses = [];

    for (let i = 0; i < this.allGraphData.length; i++) {
      districtsLabel.push(this.allGraphData[i].district_name);

      outcomeCount.push(Number(this.allGraphData[i].outcome));
      classroomTransactionCount.push(Number(this.allGraphData[i].effective_classroom_transaction));
      schoolSafetyAndChildProtection.push(Number(this.allGraphData[i].school_safety_and_child_protection));
      digitalLearning.push(Number(this.allGraphData[i].digital_learning));
      governanceProcesses.push(Number(this.allGraphData[i].governance_processes));

    }
    this.setOutcome(outcomeCount, districtsLabel);
    this.setClassroomTransaction(classroomTransactionCount, districtsLabel);
    this.setschoolSafetyAndChildProtection(schoolSafetyAndChildProtection, districtsLabel);
    this.setDigitalLearning(digitalLearning, districtsLabel);
    this.setGovernanceProcesses(governanceProcesses, districtsLabel);
  }

  setOutcome(outcomeCount: any, districtsLabel: any) {
    this.outcomeGraph = this.graphService.VerticleBarGraph();
    this.outcomeGraph.series = [{ name: "Count", data: outcomeCount }];
    this.outcomeGraph.xaxis.categories = [...districtsLabel];
    this.outcomeGraph.plotOptions.bar.horizontal = false;
    this.outcomeGraph.xaxis.title.text = "Districts";
    this.outcomeGraph.yaxis.title.text = "Count";
  }

  setClassroomTransaction(classroomTransactionCount: any, districtsLabel: any) {
    this.classroomTransaction = this.graphService.LineGraph();
    this.classroomTransaction.series = [{ name: "Count", data: classroomTransactionCount }];
    this.classroomTransaction.xaxis.categories = [...districtsLabel];
    this.classroomTransaction.xaxis.title.text = "Districts";
    this.classroomTransaction.yaxis.title.text = "Count";
  }

  setschoolSafetyAndChildProtection(schoolSafetyAndChildProtection: any, districtsLabel: any) {
    this.schoolSafetyAndChildProtection = this.graphService.VerticleBarGraph();
    this.schoolSafetyAndChildProtection.series = [{ name: "Count", data: schoolSafetyAndChildProtection }];
    this.schoolSafetyAndChildProtection.xaxis.categories = [...districtsLabel];
    this.schoolSafetyAndChildProtection.plotOptions.bar.horizontal = false;
    this.schoolSafetyAndChildProtection.xaxis.title.text = "Districts";
    this.schoolSafetyAndChildProtection.yaxis.title.text = "Count";
  }

  setDigitalLearning(digitalLearning: any, districtsLabel: any) {
    this.digitalLearning = this.graphService.VerticleBarGraph();
    this.digitalLearning.series = [{ name: "Count", data: digitalLearning }];
    this.digitalLearning.xaxis.categories = [...districtsLabel];
    this.digitalLearning.plotOptions.bar.horizontal = false;
    this.digitalLearning.xaxis.title.text = "Districts";
    this.digitalLearning.yaxis.title.text = "Count";
  }

  setGovernanceProcesses(governanceProcesses: any, districtsLabel: any) {
    this.governanceProcesses = this.graphService.LineGraph();
    this.governanceProcesses.series = [{ name: "Count", data: governanceProcesses }];
    this.governanceProcesses.xaxis.categories = [...districtsLabel];
    this.governanceProcesses.xaxis.title.text = "Districts";
    this.governanceProcesses.yaxis.title.text = "Count";
  }

}
