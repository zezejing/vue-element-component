<template>
  <div class="footer">
    <slot name="footer">
      Copyright ©2022-{{ nowData }} 技术支持 Miss Wang QQ：842731712 wechat：Eliauk-Wangjing
    </slot>
  </div>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      nowData: moment().format("YYYY")
    };
  }
};
</script>
<style lang="scss" scoped>
.footer {
  color: #909399;
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  padding: 5px 10px;
  margin: 0 auto;
}
</style>
