import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { GraphService } from 'src/app/services/graph-service.service';
import { HttpServiceService } from 'src/app/services/http-service.service';

@Component({
  selector: 'app-diksha',
  templateUrl: './diksha.component.html',
  styleUrls: ['./diksha.component.css']
})
export class DikshaComponent {

  allMedium: any = ['English', 'Hindi', 'Sanskrit', 'Marathi']
  allSubjects: any = ["Mathematics", 'Sst', 'Science', "Evs", "Language", "English", "Mil"];
  allGrade: any = ["Class 8", "Class 3", "Class 10", "Class 5"];

  allQrCoverage: any;
  allQRCodeCoverage: any;
  allQRCodeCoverageStatus: any;

  // dropdownModel
  mediumModel: any = this.allMedium[0];
  gradeModel: any = this.allGrade[0];
  subjectModel: any = this.allSubjects[0];

  // graphName
  TotalCountsGraph: any;
  Average_no_of_playsGraph: any;
  Average_play_timeGraph: any
  // ==
  averageQRCodeCoverageGraph: any;
  averageQRCodeLinkedToContentGraph: any;
  averageTotalQRCodeGraph: any;
  // ==
  averageLinkedQRCountGraph: any;
  averageResourceCountGraph: any;

  constructor(private httpService: HttpServiceService, private graphService: GraphService, private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.getAllAverageQRCodeCoverageStatus();
    this.getAllAverageQRCodeCoverage();
    this.getAllCounts_learningsession();
  }

  // ====== 3 ======
  getAllCounts_learningsession() {
    this.clearAllData();
    const data = {
      "medium": this.mediumModel,
      "grade": this.gradeModel,
      "subject": this.subjectModel
    }
    if (!this.mediumModel) {
      delete data.medium;
    }
    if (!this.gradeModel) {
      delete data.grade;
    }
    if (!this.subjectModel) {
      delete data.subject;
    }
    this.httpService.post('learningsession/counts-learningsession', data).subscribe((data: any) => {
      if (data) {
        const AllCounts_learningsession = data
        this.getTotalCountGraph(AllCounts_learningsession)
        this.getTotalAverage_no_of_playsGraph(AllCounts_learningsession)
        this.getTotalAverage_play_timeGraph(AllCounts_learningsession)
      }
    })
  }

  getTotalCountGraph(all_Data: any) {
    const LableName = all_Data.map((item: any) => item._id)
    const TotalCounts = all_Data.map((item: any) => item.counts)
    this.TotalCountsGraph = this.graphService.PieGraph('donut', '');
    const series = TotalCounts;
    const labels = LableName
    this.TotalCountsGraph.series = [...series];
    this.TotalCountsGraph.labels = [...labels]
  }

  getTotalAverage_no_of_playsGraph(all_Data: any) {
    const LableName = all_Data.map((item: any) => item._id)
    const Average_no_of_playsCount = all_Data.map((item: any) => item.average_no_of_plays)
    this.Average_no_of_playsGraph = this.graphService.PieGraph('donut', '');
    const series = Average_no_of_playsCount.map((item: any) => item);
    const labels = LableName
    this.Average_no_of_playsGraph.series = [...series];
    this.Average_no_of_playsGraph.labels = [...labels]
  }

  getTotalAverage_play_timeGraph(all_Data: any) {
    const LableName = all_Data.map((item: any) => item._id)
    const Average_play_timeCounts = all_Data.map((item: any) => item.average_play_time)
    this.Average_play_timeGraph = this.graphService.PieGraph('donut', '');
    const series = Average_play_timeCounts.map((item: any) => item);
    const labels = LableName;
    this.Average_play_timeGraph.series = [...series];
    this.Average_play_timeGraph.labels = [...labels];
  }

  clearAllData() {
    this.averageLinkedQRCountGraph = {};
    this.averageResourceCountGraph = {};

    this.averageQRCodeCoverageGraph = {};
    this.averageQRCodeLinkedToContentGraph = {};
    this.averageTotalQRCodeGraph = {};

    this.TotalCountsGraph = {};
    this.Average_no_of_playsGraph = {};

  }

  // ====== 2 tab ======
  getAllAverageQRCodeCoverage() {
    this.clearAllData();
    const data = {
      "medium": this.mediumModel,
      "grade": this.gradeModel
    }
    if (!this.mediumModel) {
      delete data.medium;
    } else if (!this.gradeModel) {
      delete data.grade;
    }
    this.httpService.post('alldashboard3/coverageqr/average', data).subscribe((data: any) => {
      this.allQRCodeCoverage = data;
      this.setAverageQRCodeCoverageGraph();
      this.setAverageQRCodeLinkedToContentGraph();
      this.setAverageTotalQRCodeGraph();
    });
  }

  setAverageQRCodeCoverageGraph() {
    this.averageQRCodeCoverageGraph = {};
    this.averageQRCodeCoverageGraph = this.graphService.VerticleBarGraph();
    const series: any = [{
      name: "Schools",
      data: []
    }];
    for (let i = 0; i < this.allQRCodeCoverage.length; i++) {
      series[0].data.push({ x: this.allQRCodeCoverage[i].subject, y: this.allQRCodeCoverage[i].averageQRCodeCoverage });
      this.averageQRCodeCoverageGraph.xaxis.categories.push(this.allQRCodeCoverage[i].subject);
    }
    this.averageQRCodeCoverageGraph.series = [...series];
    this.averageQRCodeCoverageGraph.plotOptions.bar.horizontal = false;
  }

  setAverageQRCodeLinkedToContentGraph() {
    this.averageQRCodeLinkedToContentGraph = {};
    this.averageQRCodeLinkedToContentGraph = this.graphService.VerticleBarGraph();
    const series: any = [{
      name: "Schools",
      data: []
    }];
    for (let i = 0; i < this.allQRCodeCoverage.length; i++) {
      series[0].data.push({ x: this.allQRCodeCoverage[i].subject, y: this.allQRCodeCoverage[i].averageQRCodeLinkedToContent });
      this.averageQRCodeLinkedToContentGraph.xaxis.categories.push(this.allQRCodeCoverage[i].subject);
    }
    this.averageQRCodeLinkedToContentGraph.series = [...series];
    this.averageQRCodeLinkedToContentGraph.plotOptions.bar.horizontal = false;
  }

  setAverageTotalQRCodeGraph() {
    this.averageTotalQRCodeGraph = {};
    this.averageTotalQRCodeGraph = this.graphService.VerticleBarGraph();
    const series: any = [{
      name: "Schools",
      data: []
    }];
    for (let i = 0; i < this.allQRCodeCoverage.length; i++) {
      series[0].data.push({ x: this.allQRCodeCoverage[i].subject, y: this.allQRCodeCoverage[i].averageTotalQRCode });
      this.averageTotalQRCodeGraph.xaxis.categories.push(this.allQRCodeCoverage[i].subject);
    }
    this.averageTotalQRCodeGraph.series = [...series];
    this.averageTotalQRCodeGraph.plotOptions.bar.horizontal = false;
  }

  // 1st Tab
  getAllAverageQRCodeCoverageStatus() {
    this.clearAllData();
    const data = {
      "medium": this.mediumModel,
      "grade": this.gradeModel
    }
    if (!this.mediumModel) {
      delete data.medium;
    } else if (!this.gradeModel) {
      delete data.grade;
    }
    this.httpService.post('alldashboard3/coverageqr/status/average', data).subscribe((data: any) => {
      this.allQRCodeCoverageStatus = data;
      this.setAverageLinkedQRCountGraph();
      this.setAverageResourceCountGraph();
    });
  }

  setAverageLinkedQRCountGraph() {
    this.averageLinkedQRCountGraph = {};
    this.averageLinkedQRCountGraph = this.graphService.VerticleBarGraph();
    const series: any = [{
      name: "Count",
      data: []
    }];
    for (let i = 0; i < this.allQRCodeCoverageStatus.length; i++) {
      series[0].data.push({ x: this.allQRCodeCoverageStatus[i].subject, y: Number(this.allQRCodeCoverageStatus[i].averageLinkedQRCount).toFixed(2) });
      this.averageLinkedQRCountGraph.xaxis.categories.push(this.allQRCodeCoverageStatus[i].subject);
    }
    this.averageLinkedQRCountGraph.series = [...series];
    this.averageLinkedQRCountGraph.plotOptions.bar.horizontal = false;
  }

  setAverageResourceCountGraph() {
    this.averageResourceCountGraph = {};
    this.averageResourceCountGraph = this.graphService.VerticleBarGraph();
    const series: any = [{
      name: "Count",
      data: []
    }];
    for (let i = 0; i < this.allQRCodeCoverageStatus.length; i++) {
      series[0].data.push({
        x: this.allQRCodeCoverageStatus[i].subject, y: Number(this.allQRCodeCoverageStatus[i].averageResourceCount).toFixed(2)
      });
      this.averageResourceCountGraph.xaxis.categories.push(this.allQRCodeCoverageStatus[i].subject);
    }
    this.averageResourceCountGraph.series = [...series];
    this.averageResourceCountGraph.plotOptions.bar.horizontal = false;
  }
}
