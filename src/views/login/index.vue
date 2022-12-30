<template>
  <Login>
    <template slot="footer">
      Copyright ©2022-{{ nowData }} 技术支持 Miss Wang QQ：842731712 wechat：Eliauk-Wangjing
    </template>
  </Login>
</template>

<script>
import Login from "@/components/Login";
import moment from "moment";
export default {
  components: { Login },
  data() {
    return {
      nowData: moment().format("YYYY")
    };
  },
  created() {
  }
};
</script>
