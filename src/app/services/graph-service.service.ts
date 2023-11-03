import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class GraphService {

    VerticleBarGraph() {
        const graphData = {
            series: [],
            chart: {
                type: "bar",
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
                enabled: false
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
                        color: "#6d7fcc",
                        fontWeight: "600"
                    }
                }
            },
            yaxis: {
                title: {
                    text: "",
                    style: {
                        fontSize: "14px",
                        color: "#6d7fcc",
                        fontWeight: "600"
                    }
                },
            }
        }
        return graphData;
    }

    PieGraph(chartType: any, totalType: any) {
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

}