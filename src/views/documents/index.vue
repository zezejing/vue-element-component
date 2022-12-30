<template>
  <div class="app-container">
    <el-button type="primary" size="small" @click="handleClick">打印单据</el-button>
    <el-drawer
      title="库存损益单"
      :visible.sync="drawer"
      direction="rtl"
      size="900px"
      class="sa-drawer"
    >
      <div class="drawer_content" element-loading-text="加载中...">
        <div class="drawer_top">
          <documents :default-data="defaultData" :print-data="printData"></documents>
        </div>
        <div class="drawer_footer">
          <el-button @click="drawer = false" size="small">取 消</el-button>
          <el-button type="primary" size="small" v-print="'#printMe'"> 打印损益确认单 </el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import Documents from "@/components/Documents/index";
import moment from "moment";
export default {
  components: {
    Documents
  },
  data() {
    return {
      // 按钮加载
      btn_load: false,
      drawer: false,

      // 配置默认打印信息
      defaultData: {
        // 标题
        title: "小镜子科技有限公司",
        // 副标题
        subtitle: "损益确认单",
        // 是否有效
        is_effective: "正单有效",
        // 是否显示合计
        is_total_price: true
      },
      // 打印数据
      printData: {
        // 第几次打印
        print_count: 0,
        // 订单号
        order_no: "2022031410310101",
        // 门店
        shop_name: "测试门店",
        // 组织
        warehouse_name: "测试门店",
        // 有效日期
        updated_at: "2022-03-14",
        // 当前打印时间
        print_time: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        // 打印人
        login_user: "张三",
        // 制单人
        created_employee: "张三",
        // 合计
        total_price: "1188.00",

        // 列表数据
        listData: [
          {
            product_code: "1004404",
            product_name: "1/2打印纸",
            spec_name: "规格：(ZL)241-4，1/2，",
            unit_name: "箱",
            batch_number: "2020-09-17-00165",
            price: "198.00",
            old_quantity: "2",
            last_quantity: "10",
            spread: "8",
            spread_price: "594.00"
          },
          {
            product_code: "1004405",
            product_name: "柔润保湿乳液",
            spec_name: "规格：50g",
            unit_name: "瓶",
            batch_number: "210422J1S",
            price: "198.00",
            old_quantity: "2",
            last_quantity: "10",
            spread: "8",
            spread_price: "594.00"
          }
        ],
        // 表头
        defaultHead: [
          {
            type: "index",
            align: "center",
            minWidth: "30"
          },
          {
            prop: "product_code",
            label: "商品编码",
            align: "center",
            minWidth: "60",
            tooltip: false
          },
          {
            prop: "product_name",
            label: "商品名称",
            align: "center",
            minWidth: "80",
            tooltip: false
          },
          {
            prop: "spec_name",
            label: "规格",
            align: "center",
            minWidth: "60",
            tooltip: false
          },
          {
            prop: "unit_name",
            label: "单位",
            align: "center",
            minWidth: "40",
            tooltip: false
          },
          {
            prop: "batch_number",
            label: "批号",
            align: "center",
            minWidth: "70",
            tooltip: false
          },
          {
            prop: "price",
            label: "售价",
            align: "center",
            minWidth: "50",
            hj: "price",
            tooltip: false
          },
          {
            prop: "old_quantity",
            label: "库存数",
            align: "center",
            minWidth: "50",
            hj: "num",
            tooltip: false
          },
          {
            prop: "last_quantity",
            label: "实盘数",
            align: "center",
            minWidth: "50",
            hj: "num",
            tooltip: false
          },
          {
            prop: "spread",
            label: "盈亏数",
            align: "center",
            minWidth: "50",
            hj: "num",
            tooltip: false
          },
          {
            prop: "spread_price",
            label: "盈亏金额",
            align: "center",
            minWidth: "50",
            hj: "price",
            tooltip: false
          }
        ]
      }
    };
  },
  methods: {
    handleClick() {
      this.drawer = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.sa-drawer {
  .drawer_content {
    display: flex;
    flex-direction: column;
    height: 100%;
    .drawer_top {
      padding-top: 20px;
      padding-left: 20px;
      padding-right: 20px;
      flex: 1;
      overflow: auto;
      padding-bottom: 40px;
    }
    .drawer_footer {
      text-align: center;
      padding: 10px 0;
      z-index: 1;
      background-color: #fff;
      box-shadow: 0 0 8px 0 rgb(232 237 250 / 60%), 0 2px 4px 0 rgb(232 237 250 / 50%);
    }
  }
}
</style>
