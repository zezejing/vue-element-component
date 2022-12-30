<template>
  <div class="app-container">
    <h1>饼图</h1>
    <charts
      :id="'pieCharts'"
      :default-data="defaultData"
      :chart-data="chartData"
      :type="'pie'"
      width="100%"
      height="450px"
    ></charts>
    <h1>折线图</h1>
    <charts
      :id="'lineCharts'"
      :default-data="defaultData"
      :chart-data="lineData"
      :type="'line'"
      width="100%"
      height="500px"
    ></charts>
    <h1>柱形图</h1>
    <charts
      :id="'barCharts'"
      :default-data="defaultData"
      :chart-data="lineData"
      :type="'bar'"
      width="100%"
      height="500px"
    ></charts>
  </div>
</template>
<script>
import Charts from "@/components/Echarts/index";
export default {
  components: {
    Charts
  },
  data() {
    return {
      // 默认配置
      defaultData: {
        titleText: "访问量统计",
        subText: "",
        xText: "类别",
        yText: "总访问量",
        type: "pie"
      },
      // 数据
      chartData: [
        { name: "类别1", count: 10 },
        { name: "类别2", count: 20 },
        { name: "类别3", count: 30 },
        { name: "类别4", count: 40 },
        { name: "类别5", count: 50 },
        { name: "类别6", count: 60 },
        { name: "类别7", count: 70 },
        { name: "类别8", count: 80 }
      ],
      // 折线数据
      lineData: {
        xAxisTitle: "周期/星期",
        yAxisTitle: "访问量",
        xAxis: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], //x轴
        list: [
          {
            name: "Email",
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "Union Ads",
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: "Video Ads",
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: "Direct",
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: "Search Engine",
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      }
    };
  }
};
</script>
