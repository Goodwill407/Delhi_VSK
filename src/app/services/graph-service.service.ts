import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class GraphService {

    districtWiseGraph() {
        const graphData = {
            series: [
              {
                name: "PRESENT",
                data: []
              },
              {
                name: "ABSENT",
                data: []
              }
            ],
            chart: {
              type: "bar",
              height: 300,
              stacked: true,
              stackType: "100%"
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    position: "bottom",
                    offsetX: -10,
                    offsetY: 0
                  }
                }
              }
            ],
            xaxis: {
              categories: []
            },
            fill: {
              opacity: 1
            },
            legend: {
              position: "right",
              offsetX: 0,
              offsetY: 50
            
          }
        }
        return graphData;
    }

    VerticleBarGraph() {
        const graphData = {
            series: [],
            chart: {
                type: "bar",
                height: "300px",
                events: {
                    click: function (chart: any, w: any, e: any) {
                    }
                }
            },
            plotOptions: {
                bar: {
                    columnWidth: "45%",
                    distributed: true,
                    horizontal: true
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val: any, opt: any) {
                    return val;
                },
                dropShadow: {
                    enabled: true
                },
            },
            legend: {
                show: false
            },
            grid: {
                show: false
            },
            xaxis: {
                categories: [],
                title: {
                    text: "",
                    style: {
                        fontSize: "14px",
                        color: "#3d9be9",
                        fontWeight: "600"
                    }
                }
            },
            yaxis: {
                title: {
                    text: "",
                    style: {
                        fontSize: "14px",
                        color: "#3d9be9",
                        fontWeight: "600"
                    }
                },
            }
        }
        return graphData;
    }

    HorizontalBarGraph() {
        const graphData = {
            series: [
            ],
            chart: {
                height: 300,
                type: "line",
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: "straight"
            },
            title: {
                text: "Product Trends by Month",
                align: "left"
            },
            grid: {
                row: {
                    colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                    opacity: 0.5
                }
            },
            xaxis: {
                categories: [],
                title: {
                    text: "",
                    style: {
                        fontSize: "14px",
                        color: "#3d9be9",
                        fontWeight: "600"
                    }
                }
            },
            yaxis: {
                title: {
                    text: "",
                    style: {
                        fontSize: "14px",
                        color: "#3d9be9",
                        fontWeight: "600"
                    }
                },
            }
        }
        return graphData;
    }

    PieGraph(chartType: any, totalType?: any) {
        const graphData = {
            series: [],
            chart: {
                type: chartType,
                width: 380,
            },
            dataLabels: {
                enabled: false
            },
            fill: {
                type: "gradient"
            },
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                            total: {
                                show: true,
                                formatter: (w: any) => {
                                    return w.globals.seriesTotals.reduce((a: any, b: any) => {
                                        return a + b
                                    }, 0) + totalType
                                }
                            }
                        }
                    }
                }
            },
            labels: [],
            legend: {
                position: 'bottom',
                formatter: function (val: any, opts: any) {
                    return val + " - " + opts.w.globals.series[opts.seriesIndex];
                },
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: "bottom"
                        }
                    }
                }
            ],
        }
        return graphData;
    }

    PolarGraph() {
        const graphData = {
            series: [],
            chart: {
                type: "polarArea",
                width: 380,
            },
            stroke: {
                colors: ["#fff"]
            },
            fill: {
                opacity: 0.8
            },
            legend: {
                position: 'bottom'
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: "bottom"
                        }
                    }
                }
            ],
            labels: []
        }
        return graphData;
    }

    TreeGraph() {
        const graphData = {
            series: [
                {
                    data: []
                }
            ],

            legend: {
                show: false
            },
            chart: {
                type: "treemap"
            }
        }
        return graphData;
    }

    LineGraph() {
        const graphData = {
            series: [],
            chart: {
                height: 350,
                type: "line",
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: "straight"
            },
            grid: {
                row: {
                    colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                    opacity: 0.5
                }
            },
            xaxis: {
                categories: [],
                title: {
                    text: "",
                    style: {
                        fontSize: "14px",
                        color: "#3d9be9",
                        fontWeight: "600"
                    }
                }
            },
            yaxis: {
                title: {
                    text: "",
                    style: {
                        fontSize: "14px",
                        color: "#3d9be9",
                        fontWeight: "600"
                    }
                },
            }
        }
        return graphData;
    }

}