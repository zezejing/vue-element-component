<template>
  <div id="printMe">
    <div class="print-box">
      <div ref="printHeader">
        <h2>{{ defaultData.title }}</h2>
        <h2>
          {{ defaultData.subtitle }} <span>第[{{ printData.print_count }}]次打印</span>
        </h2>
        <slot name="printHeader">
          <div>
            <el-row :gutter="20" class="print-box-span">
              <el-col :span="16"> {{ defaultData.is_effective }} </el-col>
              <el-col :span="8"> 单据号：{{ printData.order_no }} </el-col>
            </el-row>
            <el-row :gutter="20" class="print-box-span">
              <el-col :span="8"> 盘点组织：{{ printData.shop_name }} </el-col>
              <el-col :span="8"> 盘点仓库：{{ printData.warehouse_name }} </el-col>
              <el-col :span="8"> 生效日期：{{ printData.updated_at }} </el-col>
            </el-row>
          </div>
        </slot>
      </div>

      <b-table
        :data="printData.listData"
        :columns="printData.defaultHead"
        @handle-column="
          (arr) => {
            defaultHead = arr;
          }
        "
        :showPage="false"
        :showsummary="true"
      ></b-table>

      <div ref="printFooter">
        <el-row :gutter="20" class="print-box-span1" v-if="defaultData.is_total_price">
          <el-col :span="20">
            <h2 class="text-left">合计：人民币{{ printData.total_price | toChies }}</h2>
          </el-col>
        </el-row>
        <slot name="printHeader">
          <el-row :gutter="20" class="print-box-span1">
            <el-col :span="10"> 打印时间：{{ printData.print_time }} </el-col>
            <el-col :span="10"> 打印人：{{ printData.login_user }} </el-col>
            <el-col :span="4" class="text-right"> 第1页/共1页 </el-col>
          </el-row>
          <el-row :gutter="20" class="print-box-span print-box-bm">
            <el-col :span="10"> 制单人：{{ printData.created_employee }}</el-col>
            <el-col :span="10"> 确认人： </el-col>
            <el-col :span="4"> 负责人： </el-col>
          </el-row>
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  props: {
    // 配置默认打印信息
    defaultData: {
      type: Object,
      default: () => ({
        // 标题
        title: "云南圣爱养生堂有限公司",
        // 副标题
        subtitle: "确认单",
        // 是否有效
        is_effective: "正单有效",
        // 是否显示合计
        is_total_price: false
      })
    },
    // 打印数据
    printData: {
      type: Object,
      default: () => ({
        // 第几次打印
        print_count: 0,
        // 当前打印时间
        print_time: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
      })
    }
  },
  filters: {
    //合计过滤器
    toChies: function (money) {
      let cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //汉字的数字
      let cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位
      let cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
      let cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
      let cnInteger = "整"; //整数金额时后面跟的字符
      let cnIntLast = "元"; //整型完以后的单位
      let maxNum = 999999999999999.9999; //最大处理的数字
      let IntegerNum; //金额整数部分
      let DecimalNum; //金额小数部分
      let ChineseStr = ""; //输出的中文金额字符串
      let parts; //分离金额后用的数组，预定义
      let Symbol = ""; //正负值标记
      if (money === "") {
        return "";
      }
      money = parseFloat(money);
      if (money >= maxNum) {
        alert("超出最大处理数字");
        return "";
      }
      if (money === 0) {
        ChineseStr = cnNums[0] + cnIntLast + cnInteger;
        return ChineseStr;
      }
      if (money < 0) {
        money = -money;
        Symbol = "负 ";
      }
      money = money.toString(); //转换为字符串
      if (money.indexOf(".") == -1) {
        IntegerNum = money;
        DecimalNum = "";
      } else {
        parts = money.split(".");
        IntegerNum = parts[0];
        DecimalNum = parts[1].substr(0, parts[1].length);
      }
      if (parseInt(IntegerNum, 10) > 0) {
        //获取整型部分转换
        let zeroCount = 0;
        let IntLen = IntegerNum.length;
        for (let i = 0; i < IntLen; i++) {
          let n = IntegerNum.substr(i, 1);
          let p = IntLen - i - 1;
          let q = p / 4;
          let m = p % 4;
          if (n == "0") {
            zeroCount++;
          } else {
            if (zeroCount > 0) {
              ChineseStr += cnNums[0];
            }
            zeroCount = 0; //归零
            ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
          }
          if (m == 0 && zeroCount < 4) {
            ChineseStr += cnIntUnits[q];
          }
        }
        ChineseStr += cnIntLast;
        //整型部分处理完毕
      }
      if (DecimalNum != "") {
        //小数部分
        let decLen = DecimalNum.length;
        for (let i = 0; i < decLen; i++) {
          let n = DecimalNum.substr(i, 1);
          if (n != "0") {
            ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
          }
        }
      }
      if (ChineseStr == "") {
        ChineseStr += cnNums[0] + cnIntLast + cnInteger;
      } else if (DecimalNum == "") {
        ChineseStr += cnInteger;
      }
      ChineseStr = Symbol + ChineseStr;

      return ChineseStr;
    }
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
/* --- 打印单样式 --- */
.print-box {
  width: 833px;
  font-family: Arial, Helvetica, sans-serif;
  margin: 0 auto;
  color: #000;
  h2 {
    width: 100%;
    font-size: 16px;
    font-weight: bold;
    line-height: 22px;
    text-align: center;
    margin: 0;
    position: relative;
    span {
      font-weight: bold;
      display: inline-block;
      position: absolute;
      right: 10px;
    }
  }
  .print-box-span {
    font-size: 14px;
    line-height: 22px;
  }
  .print-box-span1 {
    font-size: 13px;
    line-height: 22px;
  }
  .print-box-bm {
    border-top: 1px dashed #000;
    margin-top: 5px;
    margin-left: 0px !important;
    margin-right: 0px !important;
  }
  .print-box-top {
    margin-top: 30px;
  }
  .text-left {
    text-align: left;
  }
  .text-right {
    text-align: right;
  }
  ::v-deep .el-table {
    margin: 5px 0;
    border: 1px dashed #000;
  }
  ::v-deep .el-table .cell,
  ::v-deep .el-table--border .el-table__cell:first-child .cell {
    padding-left: 0;
    padding-right: 0;
  }
  ::v-deep .el-table__footer-wrapper td,
  ::v-deep .el-table__fixed-footer-wrapper tbody td.el-table__cell {
    border-top: 1px dashed #000;
    background-color: #ffffff;
  }
  ::v-deep .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
    background-color: #ffffff;
  }
  ::v-deep .el-table td,
  ::v-deep .el-table th.is-leaf {
    border-bottom: 1px dashed #000;
  }
  ::v-deep .el-table thead tr,
  ::v-deep .el-table thead th {
    padding: 5px 0;
    background-color: #ffffff;
  }
  ::v-deep .el-table td,
  ::v-deep .el-table th {
    padding: 3px 0;
  }
}
</style>
