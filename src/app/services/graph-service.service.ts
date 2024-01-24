import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class GraphService {
    itemCount: any = 0;

    districtWiseGraph() {
        const graphData = {
            series: [
                {
                    name: "",
                    data: []
                },
                {
                    name: "",
                    data: []
                },
                {
                    name: "",
                    data: []
                },
                {
                    name: "",
                    data: []
                },

            ],
            chart: {
                type: "bar",
                height: 250,
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

    VerticleBarGraph(isFunnel?: any) {
        let colors = [];
        for (let i = 0; i < 5; i++) {
            colors.push(this.getRandomColor(i))
        }
        const graphData = {
            series: [],
            chart: {
                type: "bar",
                height: 300,
                events: {
                    click: function (chart: any, w: any, e: any) {
                    }
                }
            },
            fill: {
                colors: colors
            },
            colors: colors,
            plotOptions: {
                bar: {
                    columnWidth: "20%", // You can adjust the columnWidth as needed
                    distributed: true,
                    horizontal: true
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val: any, opt: any) {
                    if (isFunnel) {
                        return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
                    } else {
                        return val;
                    }
                },
                dropShadow: {
                    enabled: false
                },
                style: {
                    colors: ["#36454F"]
                }
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
                },
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
                labels: {
                    maxWidth: 250,
                    style: {
                        fontSize: '10px'
                    }
                }
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

    getRandomColor(i: any) {
        // var color = "hsl(" + Math.random() * 360 + ", 100%, 70%)";
        var color = ["#7ED7C1", "#F9B572", "#CBB279", "#73A9AD", "#DC8686"]
        // var color = ["#E63946", "#EDAE49", "#3376BD", "#00798C", "#52489C"];
        // var color = ["#063951", "#c13018", "#f36f13", "#ebcb38", "#a2b969"];
        // var color = ["#ed6f1b", "#1cbb9d", "#0890c0", "#435273", "#d63d51"];
        return color[i];
    }

    PieGraph(chartType: any, totalType?: any, sumType?: any) {
        let colors = [];
        for (let i = 0; i < 5; i++) {
            colors.push(this.getRandomColor(i))
        }
        const graphData = {
            series: [],
            chart: {
                type: chartType
            },
            dataLabels: {
                enabled: false
            },
            fill: {
                colors: colors
            },
            tooltip: {
                
            },
            colors: colors,
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                            name: {
                                formatter: () => {
                                    return 'Total' + ' ' + totalType
                                }
                            },
                            total: {
                                show: true,

                                formatter: (w: any) => {
                                    const sum = w.globals.seriesTotals.reduce((a: any, b: any) => {
                                        a = (a % 1 != 0) ? Number(a.toFixed(2)) : a;
                                        b = (b % 1 != 0) ? Number(b.toFixed(2)) : b;
                                        return a + b;
                                    }, 0);
                                    if (sumType == 'percentage') {
                                        return sum + '%';
                                    } else {
                                        return sum;
                                    }
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
                    opts.w.globals.series[opts.seriesIndex] = (opts.w.globals.series[opts.seriesIndex] % 1 != 0) ? Number(opts.w.globals.series[opts.seriesIndex].toFixed(2)) : opts.w.globals.series[opts.seriesIndex];

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

    PolarGraph(toolTipName?: any) {
        let colors = [];
        for (let i = 0; i < 5; i++) {
            colors.push(this.getRandomColor(i))
        }
        const graphData = {
            series: [],
            chart: {
                type: "polarArea"
            },
            fill: {
                colors: colors,
            },
            colors: colors,
            legend: {
                position: 'bottom'
            },
            yaxis: {
                show: true
            },
            tooltip: {
                y: {
                    title: {
                        formatter: (val: any) => {
                            return val + ':'
                        }
                    }
                }
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

    private itemCountSubject = new BehaviorSubject<number>(0);

    getItemCountObservable() {
        return this.itemCountSubject.asObservable();
    }

    private updateItemCount() {
        this.itemCountSubject.next(this.itemCount);
    }

    addToCart(): void {
        this.itemCount++;
        this.updateItemCount();
    }

}