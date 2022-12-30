<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }"></div>
</template>
<script>
// import echarts from "echarts"; //版本过高无法使用
import * as echarts from "echarts";
import resize from "./mixins/resize";
export default {
  mixins: [resize],
  props: {
    // class类名
    className: {
      type: String,
      default: "chart"
    },
    // 图表唯一标识，当id重复将会报错
    id: {
      type: String,
      default: "chart"
    },
    // 图表宽度
    width: {
      type: String,
      default: "100%"
    },
    // 图表高度
    height: {
      type: String,
      default: "300px"
    },
    // 图表类型，提供三种(line：折线  bar：柱形  pie：饼图)
    type: {
      type: String,
      default: "line"
    },
    // 默认配置数据
    defaultData: {
      type: Object,
      default: () => ({
        //图表标题
        titleText: "访问量统计",
        // 图表副标题
        subText: "",
        // x轴描述
        xText: "类别",
        // y轴描述
        yText: "总访问量",
        // 饼图类型 0：普通 1：环形图 2：玫瑰图
        pieType: 0,
        // 是否圆角环形图
        isRadius: false,
        // 是否为平滑曲线
        smooth: false
      })
    },
    // 传入的数据
    chartData: {
      type: [Object, Array],
      default: () => {}
    }
  },
  watch: {
    chartData(val) {
      switch (this.type) {
        case "lie":
          this.drawLine(val);
          break;
        case "bar":
          this.drawBar(val);
          break;
        case "pie":
          this.drawPie(val);
          break;
        default:
          this.drawLine(val);
          break;
      }
    }
  },
  mounted() {
    switch (this.type) {
      case "lie":
        this.drawLine(this.chartData);
        break;
      case "bar":
        this.drawBar(this.chartData);
        break;
      case "pie":
        this.drawPie(this.chartData);
        break;
      default:
        this.drawLine(this.chartData);
        break;
    }
  },
  data() {
    return {
      // 饼图配置数据
      series: [],
      chart: null
    };
  },
  methods: {
    // 绘制折线
    drawLine(chartData) {
      const _this = this;
      this.chart = echarts.init(document.getElementById(this.id));
      let xAxisData = chartData.list.map(function (item) {
        return item.name;
      });
      let lineData = [];
      chartData.list.forEach((item) => {
        lineData.push({
          name: item.name,
          type: this.type,
          // stack: this.type === "" ? "Total" : "",
          data: item.data,
          smooth: this.defaultData.smooth
        });
      });
      this.chart.setOption({
        title: {
          text: this.defaultData.titleText,
          subtext: this.defaultData.subText,
          left: "left"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: xAxisData,
          top: "6%",
          type: "scroll"
        },
        grid: {
          top: 100,
          left: 0,
          right: "10%",
          bottom: 60,
          containLabel: true
        },
        toolbox: {
          show: true,
          orient: "vertical",
          // left: "right",
          top: "center",
          right: 20,
          feature: {
            dataView: {
              show: true,
              readOnly: false,
              optionToContent: function (opt) {
                // 绘制数据表格
                let table = _this.getTable(opt);
                return table;
              }
            },
            magicType: {
              type: ["line", "bar", "stack", "tiled"]
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: [
          {
            name: chartData.xAxisTitle,
            type: "category",
            boundaryGap: this.type === "line" ? false : true,
            data: chartData.xAxis,
            axisTick: {
              alignWithLabel: this.type === "line" ? false : true
            }
          }
        ],
        yAxis: {
          name: chartData.yAxisTitle,
          type: "value"
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100
          }
        ],
        series: lineData
      });
    },
    // 绘制柱形图
    drawBar(chartData) {
      this.drawLine(chartData);
    },
    // 绘制饼图
    drawPie(chartData) {
      this.chart = echarts.init(document.getElementById(this.id));
      let xAxisData = chartData.map(function (item) {
        return item.name;
      });
      let pieData = [];
      chartData.forEach((v) => {
        pieData.push({
          name: v.name,
          value: v.count
        });
      });
      let series = [];
      switch (this.defaultData.pieType) {
        // 环形图
        case 1:
          series = [
            {
              name: this.defaultData.xText,
              type: "pie",
              radius: ["40%", "70%"],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: this.defaultData.isRadius ? 10 : "",
                borderColor: this.defaultData.isRadius ? "#fff" : "",
                borderWidth: this.defaultData.isRadius ? 2 : ""
              },
              label: {
                show: false,
                position: "center"
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: "26",
                  fontWeight: "bold"
                }
              },
              labelLine: {
                show: false
              },
              data: pieData
            }
          ];
          break;
        case 2:
          series = [
            {
              name: this.defaultData.xText,
              type: "pie",
              radius: [50, 150],
              center: ["50%", "50%"],
              roseType: "area",
              itemStyle: {
                borderRadius: 8
              },
              data: pieData
            }
          ];
          break;
        // 默认饼图
        default:
          series = [
            {
              name: this.defaultData.xText,
              type: "pie",
              radius: "55%",
              center: ["50%", "60%"],
              data: pieData,
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          ];
          break;
      }
      this.chart.setOption({
        title: {
          text: this.defaultData.titleText,
          subtext: this.defaultData.subText,
          left: "left"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          // orient: "vertical", //垂直展示
          left: "center",
          top: "6%",
          type: "scroll",
          data: xAxisData
        },
        series: series
      });
    },
    // 绘制数据表格
    getTable(opt) {
      let axisData = opt.xAxis[0].data; //坐标数据
      let series = opt.series; //折线图数据
      let tdHeads = "<td>时间</td>"; //表头
      let tdBodys = ""; //数据
      series.forEach(function (item) {
        //组装表头
        tdHeads += `<td>${item.name}</td>`;
      });
      let table = `<table border="1" style="border-collapse:collapse;
      font-size:14px;text-align:center;width:100%;"><tbody><tr>${tdHeads} </tr>`;
      for (let i = 0, l = axisData.length; i < l; i++) {
        for (let j = 0; j < series.length; j++) {
          //组装表数据
          tdBodys += `<td>${series[j].data[i]}</td>`;
        }
        table += `<tr><td style="padding: 0 20px">${axisData[i]}</td>${tdBodys}</tr>`;
        tdBodys = "";
      }
      table += "</tbody></table>";
      return table;
    }
  }
};
</script>
