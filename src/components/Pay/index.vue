<template>
  <!-- 支付中。。查询支付单支付状态 -->
  <el-dialog
    title=""
    :visible.sync="show"
    width="520px"
    :show-close="false"
    class="pay-during"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div
      v-loading="false"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <h2>支付中</h2>
      <div class="container">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
      </div>
      <div type="text" size="small" class="during-label" style="height: 20px; line-height: 20px">
        <span v-show="timer_count" style="color: #e6a23c; font-size: 16px"
          >订单支付倒计时 {{ count }} 秒</span
        >
      </div>
      <div class="during-label">用户在支付过程中出现问题，可以点击取消支付，重新发起支付</div>
    </div>

    <div slot="footer" style="text-align: center">
      <el-button @click="cancelPay" size="small" :disabled="cancelPayLoad" :loading="cancelPayLoad"
        >取 消 支 付</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    // 父组件控制显示隐藏
    is_show: {
      tyoe: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      // 弹窗显示状态
      show: false,
      // 是否显示倒计时
      timer_count: null,
      // 倒计时
      count: 120,
      // 取消支付按钮是否禁用
      cancelPayLoad: false
    };
  },
  methods: {
    cancelPay() {
      this.$confirm("用户是否需要重新支付？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.show = false;
          this.$message("取消支付");
          this.$emit("cancel-pay");
        })
        .catch(() => {});
    }
  },
  watch: {
    is_show: {
      handler() {
        this.show = !this.show;
      },
      deep: true
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep.pay-during {
  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0;
    padding: 20px;
    padding-top: 20px;
  }

  h2 {
    text-align: center;
    font-size: 24px;
    font-weight: 400;
    color: #4695b8;
    margin-top: 0px;
  }

  .during-label {
    text-align: center;
    font-weight: 400;
    color: #be4141;
    margin-bottom: 10px;
    font-size: 14px;
  }
}
.container {
  height: 100px;
  text-align: center;
  margin: 30px auto;
}

.circle {
  margin: 20px;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  display: inline-block;
  transform: scale(0);
  animation: bulge 2s infinite ease-in-out;
}

.circle::after {
  position: absolute;
  display: inline-block;
  content: "";
  height: 100%;
  width: 100%;
  border-radius: 50%;
  background-color: inherit;
  top: 0;
  left: 0;
  z-index: -1;
  transform: scale(1);
  animation: blow 2s infinite ease-in-out;
}

.circle:nth-child(1) {
  background-color: #4695b8;
  animation-delay: 0s;
}

.circle:nth-child(2) {
  background-color: #67a142;
  animation-delay: 0.25s;
}

.circle:nth-child(3) {
  background-color: #8fc0a7;
  animation-delay: 0.5s;
}

@keyframes bulge {
  50% {
    transform: scale(1);
  }
}

@keyframes blow {
  25% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.5;
  }
  90% {
    opacity: 0;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>
